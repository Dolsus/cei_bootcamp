import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of, take } from 'rxjs';
import { UsersData } from 'src/app/shared/security/users-data';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardTask, taskPriority } from '../../services/dashboard-task';
import { DashboardService } from '../../services/dashboard.service';

import { DashboardTaskEditComponent } from './dashboard-task-edit.component';

describe('DashboardTaskEditComponent', () => {
  let component: DashboardTaskEditComponent;
  let fixture: ComponentFixture<DashboardTaskEditComponent>;
  let mockDashboardService: any;
  let testTask: DashboardTask;

  beforeEach(async () => {
    mockDashboardService = jasmine.createSpyObj([
      'getTask',
      'createTask',
      'updateTask',
      'deleteTask',
    ]);
    await TestBed.configureTestingModule({
      declarations: [DashboardTaskEditComponent],
      imports: [SharedModule, RouterTestingModule],
      providers: [
        { provide: DashboardService, useValue: mockDashboardService },
      ],
    }).compileComponents();

    testTask = {
      id: 1,
      title: 'first task',
      difficulty: 5,
      priority: taskPriority.high,
      completed: false,
      dueDate: new Date(),
      subTasks: [
        {
          id: 1.1,
          title: 'first subtask',
          difficulty: 1,
          priority: taskPriority.low,
          completed: false,
        },
        {
          id: 1.2,
          title: 'second subtask',
          difficulty: 1,
          priority: taskPriority.low,
          completed: false,
        },
      ],
    };
    fixture = TestBed.createComponent(DashboardTaskEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize in "create" mode without an input', () => {
    expect(component.taskId).toBe(0);
  });

  it('should populate a form with a task ID input', async () => {
    component.taskId = 1;
    mockDashboardService.getTask.and.returnValue(of(testTask));
    //NOTE: this failed when calling ngOnInit or firing change detection again
    // need to do research as to why.
    component.checkComponentInputs();

    let taskID: number = component.taskForm.get('id').value;
    let taskTitle: string = component.taskForm.get('title').value;

    expect(fixture.componentInstance.taskForm.get('title').value).toBe(
      'first task'
    );

    expect(taskID).toBe(1);
    expect(taskTitle).toBe('first task');
    expect(mockDashboardService.getTask).toHaveBeenCalledOnceWith(1);
  });

  it('should initialize a form', () => {
    expect(component.taskForm).toBeDefined();
  });

  it('should be invalid when form is empty', () => {
    expect(component.taskForm.valid).toBeFalsy();
  });

  it('should error check required fields', () => {
    let title = component.taskForm.get('title');
    let titleCtrl = component.taskForm.controls['title'];

    component.checkAllValidation();
    component.setMsg(title, 'title');
    let titleErr = component.errMsg['title'];

    expect(titleErr).toBe('This field is required.');

    titleCtrl.setValue('test');
    component.checkAllValidation();
    component.setMsg(title, 'title');
    titleErr = component.errMsg['title'];

    expect(titleErr).toBe('');
    expect(component.taskForm.valid).toBeTrue();
  });

  //test submisison with both edit + create
  it('should submit a valid form', () => {
    let titleCtrl = component.taskForm.controls['title'];

    titleCtrl.setValue('test');
    expect(component.taskForm.valid).toBeTrue();
    component.onSave();

    component.taskChangeEvent.pipe(take(1)).subscribe((event: string) => {
      expect(event).toBe('task');
    });
  });

  it('should create/delete a subtask on button click', (() => {
    //note: this failed when trying to swap to a fakeAsync / tick method
    expect(fixture.componentInstance.subTasks.length).toBe(0);
    fixture.nativeElement.querySelector('#addSubTask').click();

    fixture.whenStable().then(() => {
      expect(component.addSubTask).toHaveBeenCalled();
      expect(component.subTasks.length).toBe(1);
      fixture.nativeElement.querySelector('#deleteSubTask0').click();
    });


    fixture.whenStable().then(() => {
      expect(component.deleteSubTask).toHaveBeenCalled();
      expect(component.subTasks.length).toBe(0);
    })
  }));
});
