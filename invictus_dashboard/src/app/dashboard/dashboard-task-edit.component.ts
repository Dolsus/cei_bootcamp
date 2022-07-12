import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  AbstractControl,
  FormArray,
  Validators
} from '@angular/forms';

import { DashboardTask, taskPriority } from './dashboard-task';
import { DashboardService } from './dashboard.service';
import { NumberValidators } from '../shared/number.validator';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'dash-dashboard-task-edit',
  templateUrl: './dashboard-task-edit.component.html',
  styleUrls: ['./dashboard-task-edit.component.css'],
})
export class DashboardTaskEditComponent implements OnInit, OnDestroy {
  taskForm: FormGroup;
  apiErrMsg: string = '';
  pageTitle: string = 'Add Task';
  priority = taskPriority;
  task: DashboardTask;
  errMsg: { [key: string]: string } = {};
  taskEditModal!: HTMLElement;
  sprintEndDateString!: string;

  private validationMsgs = {
    required: 'This field is required.',
    range: 'Please enter a number between 1 and 5.',
  };

  get subTasks(): FormArray {
    return <FormArray>this.taskForm.get('subTasks');
  }

  @Input() taskId: number;
  @Input() sprintEndDate: Date;
  @Output() taskChangeEvent: EventEmitter<string> = new EventEmitter<string>();


  constructor(
    private fb: FormBuilder,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.checkComponentInputs();
    this.buildTaskForm();

    this.addModalEventListeners();
  }

  addModalEventListeners(): void {
    this.taskEditModal = document.getElementById('addTaskModal');
    this.taskEditModal.addEventListener(
      'shown.bs.modal',
      this.initOnModalOpen.bind(this)
    );

    this.taskEditModal.addEventListener(
      'hidden.bs.modal',
      this.onSaveComplete.bind(this)
    );
  }

  initOnModalOpen(): void {
    this.checkComponentInputs();
    this.buildTaskForm();
  }

  checkComponentInputs(): void {
    if (!this.taskId || this.taskId === 0) {
      this.taskId = 0;
      this.pageTitle = 'Add Task';
    } else {
      this.pageTitle = 'Editing task with ID: ' + this.taskId;
      this.getTask(this.taskId);
    }

    if (!this.sprintEndDate) {
      this.sprintEndDate = new Date();
    }
    this.sprintEndDateString = new Date(this.sprintEndDate)
      .toISOString()
      .split('T')[0];
  }

  buildTaskForm(): void {
    this.taskForm = this.buildTaskGroup();

    this.addGroupValueChangeSubscriptions(this.taskForm);
  }

  addGroupValueChangeSubscriptions(
    group: FormGroup,
    arrayLength?: number
  ): void {
    var controlAppend: string = '';
    if (arrayLength) {
      controlAppend = arrayLength.toString();
    }

    for (let i in group.controls) {
      const validation = group.get(i);
      // console.log(i);
      this.errMsg[i] = '';
      validation?.valueChanges.pipe(debounceTime(1000)).subscribe((value) => {
        const control = i + controlAppend;
        // console.log(`${control}: ${value}`);
        this.setMsg(validation, control);
      });
    }
  }

  setMsg(c: AbstractControl, control: string): void {
    //TODO: Show validation messages is touched, dirty, or after the save button has been clicked while untouched
    this.errMsg[control] = '';
    if ((c.touched || c.dirty) && c.errors) {
      console.log(`Error for ${control}: ${Object.keys(c.errors)}`);

      this.errMsg[control] = Object.keys(c.errors)
        .map(
          (key) => this.validationMsgs[key as keyof typeof this.validationMsgs]
        )
        .join(' ');
    }
  }

  buildTaskGroup(): FormGroup {
    return this.fb.group({
      id: [this.taskId],
      title: ['', [Validators.required]],
      difficulty: [1, [Validators.required, NumberValidators.range(1, 5)]],
      priority: [taskPriority.standard, [Validators.required]],
      completed: [false, [Validators.required]],

      description: [''],
      startDate: [new Date()],
      dueDate: [this.sprintEndDateString],
      subTasks: this.fb.array([]),
    });
  }

  addSubTask(): void {
    const numSubTasks = this.subTasks.length;
    console.log('adding subtask ' + numSubTasks);

    this.subTasks.push(this.buildTaskGroup());
    const subTaskGroup: FormGroup = (
      this.taskForm.get('subTasks') as FormArray
    ).at(numSubTasks) as FormGroup;

    var subTaskId: number = numSubTasks + 1;
    while (subTaskId >= 1) {
      subTaskId /= 10;
    }

    subTaskId += this.taskForm.get('id').value;

    subTaskGroup.get('id').setValue(subTaskId);

    console.log(`sub-task id: ${subTaskGroup.get('id').value}`);

    this.addGroupValueChangeSubscriptions(subTaskGroup, numSubTasks);
  }

  deleteSubTask(index: number) {
    const subTask = (this.taskForm.get('subTasks') as FormArray).at(index);
    subTask.clearValidators();
    subTask.updateValueAndValidity();
    this.subTasks.removeAt(index);
    this.subTasks.markAsDirty();
  }

  getTask(id: number) {
    this.dashboardService.getTask(id).subscribe({
      next: (task: DashboardTask) => this.displayTask(task),
      error: (err) => (this.apiErrMsg = err),
    });
  }

  displayTask(task: DashboardTask) {
    if (this.taskForm) {
      this.taskForm.reset();
    }
    this.task = task;

    if (this.task.id === 0) {
      this.pageTitle = 'Add Task';
    } else {
      this.pageTitle = 'Edit ' + this.task.title;
    }

    this.taskForm.patchValue({
      id: this.task.id,
      title: this.task.title,
      difficulty: this.task.difficulty,
      priority: this.task.priority,
      completed: this.task.completed,

      description: this.task.description,
      startDate: this.task.startDate,
      dueDate: this.task.dueDate,
    });

    for (var index in this.task.subTasks) {
      this.addSubTask();
      var numSubTasks = this.subTasks.length;
      this.subTasks.at(numSubTasks - 1).patchValue({
        // id: this.task.id,
        title: this.task.subTasks[index].title,
        completed: this.task.subTasks[index].completed,

        description: this.task.subTasks[index].description,
        startDate: this.task.subTasks[index].startDate,
        dueDate: this.task.subTasks[index].dueDate,
      });
    }
  }

  onSave() {
    if (this.taskForm.valid) {
      if (this.taskForm.dirty) {
        console.log('Saving...');
        const t: DashboardTask = { ...this.task, ...this.taskForm.value };
        console.log(t);

        if (t.id === 0) {
          console.log(`creating task: ${t.title}`);
          this.dashboardService.createTask(t).subscribe({
            next: () => {
              // console.log('creating..');
              if (this.dashboardService.lastTaskModified) {
                this.initSubTasks(this.dashboardService.lastTaskModified);
              }
            },
            error: (err) => (this.apiErrMsg = err),
          });
        } else {
          this.dashboardService.updateTask(t).subscribe({
            next: () => {
              this.initSubTasks(t);
            },
            error: (err) => (this.apiErrMsg = err),
          });
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.apiErrMsg = 'Please correct the validation errors.';
    }
  }

  initSubTasks(task: DashboardTask) {
    console.log('initiating sub tasks');
    var subTaskAltered: boolean = false;
    for (let subTask in task.subTasks) {
      var subTaskId = task.subTasks[subTask].id;
      if (subTaskId < 1) {
        console.log(
          `subtask ${task.subTasks[subTask].title} id: ${
            task.subTasks[subTask].id
          } changed to: ${subTaskId + task.id}.`
        );
        subTaskId += task.id;
        subTaskAltered = true;
      } else {
        console.log('subtask id over 1: ' + subTaskId);
      }
    }

    if (subTaskAltered) {
      console.log('sub-tasks added. updating...');
      this.dashboardService.updateTask(task).subscribe({
        next: () => this.onSaveComplete(),
        error: (err) => (this.apiErrMsg = err),
      });
    } else {
      this.onSaveComplete();
    }
  }

  onCancel() {
    //TODO: flesh out this alert menu with back button (modal?)
    alert(
      'Warning: leaving the form will clear unsaved data. Are you sure you want to exit?'
    );
    this.taskForm.reset();
  }

  onDelete() {
    //TODO: flesh out the alert for this too
    if (!this.task.id || this.task.id === 0) {
      this.onCancel();
    } else {
      this.dashboardService.deleteTask(this.task.id).subscribe({
        next: () => this.onSaveComplete(),
        error: (err) => (this.apiErrMsg = err),
      });
    }
  }

  onSaveComplete() {
    this.taskForm.reset();
    this.taskChangeEvent.emit('task');
    document.getElementById('exitBtn').click();
  }

  ngOnDestroy(): void {
    console.log('dashboard destroyed.');
    this.taskEditModal.removeAllListeners();
  }
}
