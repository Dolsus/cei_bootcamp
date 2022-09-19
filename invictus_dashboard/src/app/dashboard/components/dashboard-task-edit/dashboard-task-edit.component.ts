import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  AbstractControl,
  FormArray,
  Validators,
} from '@angular/forms';

import { DashboardTask, taskPriority } from '../../services/dashboard-task';
import { DashboardService } from '../../services/dashboard.service';
import { NumberValidators } from '../../../shared/number.validator';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'dash-dashboard-task-edit',
  templateUrl: './dashboard-task-edit.component.html',
  styleUrls: ['./dashboard-task-edit.component.css'],
})
export class DashboardTaskEditComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  taskForm: FormGroup;
  apiErrMsg: string = '';
  pageTitle: string = 'Add Task';
  priority = taskPriority;
  task: DashboardTask;
  errMsg: { [key: string]: string } = {};
  taskEditModal!: HTMLElement;
  sprintEndDateString!: string;
  taskFormControls: string[] = [];

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

  @ViewChild('addTaskModal', { read: ElementRef })
  modalElement!: ElementRef<HTMLElement>;
  @ViewChild('exitBtn', { read: ElementRef, static: false })
  exitBtnElement!: ElementRef<HTMLElement>;

  constructor(
    private fb: FormBuilder,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.checkComponentInputs();
    this.buildTaskForm();
  }

  ngAfterViewInit(): void {
    this.addModalEventListeners();
  }

  addModalEventListeners(): void {
    if (!this.modalElement) {
      return;
    }
    this.taskEditModal = this.modalElement.nativeElement;
    this.taskEditModal.addEventListener(
      'shown.bs.modal',
      this.initOnModalOpen.bind(this)
    );
  }

  initOnModalOpen(): void {
    this.apiErrMsg = '';
    this.checkComponentInputs();
    this.buildTaskForm();
  }

  checkComponentInputs(): void {
    this.apiErrMsg = '';
    if (!this.taskId || this.taskId === 0) {
      this.taskId = 0;
    } else {
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
      this.errMsg[i] = '';
      const control = i + controlAppend;
      this.taskFormControls.push(control);
      validation?.valueChanges.pipe(debounceTime(1000)).subscribe((value) => {
        this.setMsg(validation, control);
      });
    }
  }

  setMsg(c: AbstractControl, control: string): void {
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
    console.log(subTaskId);
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
    this.dashboardService.getTask(id).subscribe((task: DashboardTask) => {
      this.displayTask(task);
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
      this.pageTitle = 'Edit ' + task.title;
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

    console.log('task form value: ', this.taskForm.get('title').value);

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
        // console.log('Saving...');
        const t: DashboardTask = { ...this.task, ...this.taskForm.value };
        console.log(t);

        if (t.id === 0) {
          // console.log(`creating task: ${t.title}`);
          this.dashboardService.createTask(t).subscribe(() => {
            if (this.dashboardService.lastTaskModified) {
              this.initSubTasks(this.dashboardService.lastTaskModified);
            }
          });
        } else {
          this.dashboardService
            .updateTask(t)
            .subscribe(() => this.initSubTasks(t));
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.apiErrMsg = 'Please correct the validation errors.';
      this.checkAllValidation();
    }
  }

  checkAllValidation(): void {
    for (let control in this.taskFormControls) {
      const validation = this.taskForm.get(this.taskFormControls[control]);
      if (validation) {
        validation.markAsTouched();
        validation.updateValueAndValidity();
        // this.setMsg(validation, this.taskFormControls[control]);
      }
    }
  }

  initSubTasks(task: DashboardTask): void {
    var subTaskAltered: boolean = false;
    for (let subTask in task.subTasks) {
      var subTaskId: number = task.subTasks[subTask].id;
      if (subTaskId < 1) {
        subTaskId += task.id;
        task.subTasks[subTask].id = subTaskId;
        subTaskAltered = true;
      }
    }

    if (subTaskAltered) {
      this.dashboardService
        .updateTask(task)
        .subscribe(() => this.onSaveComplete());
    } else {
      this.onSaveComplete();
    }
  }

  onCancel() {
    const dialogText: string =
      'Leaving the form will clear unsaved data. Are you sure you want to exit?';
    if (confirm(dialogText)) {
      this.onSaveComplete();
    }
  }

  onDelete() {
    const dialogText: string = `Delete ${
      this.taskForm.get('title').value
    }? This action cannot be undone.`;

    if (this.task.id !== 0) {
      if (confirm(dialogText)) {
        this.dashboardService
          .deleteTask(this.task.id)
          .subscribe(() => this.onSaveComplete());
      } else {
        this.onSaveComplete();
      }
    }
  }

  setDialogText(isDelete: boolean): string {
    var modalText: string = '';
    if (isDelete) {
      modalText = `Delete ${
        this.taskForm.get('title').value
      }? This action cannot be undone.`;
    } else {
      modalText =
        'Leaving the form will clear unsaved data. Are you sure you want to exit?';
    }
    return modalText;
  }

  onSaveComplete(): void {
    this.taskForm.reset();
    this.taskChangeEvent.emit('task');
    this.exitBtnElement.nativeElement.click();
  }

  ngOnDestroy(): void {
    // console.log('dashboard destroyed.');
    this.taskEditModal.removeAllListeners();
  }
}
