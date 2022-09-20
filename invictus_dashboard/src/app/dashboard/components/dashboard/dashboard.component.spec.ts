import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { SecurityService } from 'src/app/shared/security/services/security.service';
import { UsersData } from 'src/app/shared/security/users-data';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardTask, taskPriority } from '../../services/dashboard-task';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardTaskEditComponent } from '../dashboard-task-edit/dashboard-task-edit.component';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockSecurityService: any;
  let mockDashboardService: any;
  let testTaskList: DashboardTask[];

  beforeEach(async () => {
    //this will set the security object to the root user, wroot
    mockSecurityService = jasmine.createSpyObj(
      {},
      { securityObj: UsersData[2] }
    );

    mockDashboardService = jasmine.createSpyObj(['getTasks', 'updateTask']);

    testTaskList = [
      {
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
      },
      {
        id: 2,
        title: 'cool task',
        difficulty: 1,
        priority: taskPriority.low,
        completed: false,
        dueDate: new Date('06/14/2022'),
      },
      {
        id: 3,
        title: 'next task',
        difficulty: 2,
        priority: taskPriority.standard,
        dueDate: new Date(),
        completed: false,
      },
      {
        id: 4,
        title: 'completed task 1',
        difficulty: 1,
        priority: taskPriority.low,
        completed: true,
        dueDate: new Date('07/11/2022'),
      },
    ];
    mockDashboardService.getTasks.and.returnValue(of(testTaskList));

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent, DashboardTaskEditComponent],
      imports: [SharedModule, RouterTestingModule],
      providers: [
        { provide: SecurityService, useValue: mockSecurityService },
        { provide: DashboardService, useValue: mockDashboardService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have proper permissions to show the dashboard', () => {
    expect(component.securityObj.userName).toBe('wroot');
    expect(component.securityObj.canAccessTasks).toBeTrue();
  });

  it('should set a sprint start after to the current date and end date before the current date', () => {
    expect(component.startDate.getTime()).toBeLessThan(new Date().getTime());
    expect(component.endDate.getTime()).toBeGreaterThan(new Date().getTime());
  });

  it('should get the full task list on init', () => {
    expect(component.tasks.length).toBe(testTaskList.length);
  });

  it('should filter overdue, completed, and uncompleted tasks', () => {
    expect(component.uncompletedTasks.all.length).toBe(2);
    expect(component.overdueTasks.all.length).toBe(1);
    expect(component.completedTasks.all.length).toBe(1);
  });

  it('should change the "complete" status of tasks', () => {
    //checking the overdue task "cool task" with id of 2
    expect(component.overdueTasks.all[0].completed).toBeFalse();

    mockDashboardService.updateTask.and.returnValue({
      subscribe: () => {
        component.tasks[1].completed = true;
      },
    });
    fixture.nativeElement.querySelector('#overdue2').click();

    expect(component.overdueTasks.all.length).toBe(0);
  });

  it('should change the number of tasks viewed on clicking the dropdown', () => {
    // first add some dummy tasks so that the list is long enough to change
    component.completedTasks.all = [
      {
        id: 4,
        title: 'completed task 1',
        difficulty: 1,
        priority: taskPriority.low,
        completed: true,
        dueDate: new Date('07/11/2022'),
      },
      {
        id: 5,
        title: 'completed task 2',
        difficulty: 1,
        priority: taskPriority.low,
        completed: true,
        dueDate: new Date('07/11/2022'),
      },
      {
        id: 6,
        title: 'completed task 3',
        difficulty: 1,
        priority: taskPriority.low,
        completed: true,
        dueDate: new Date('07/09/2022'),
      },
      {
        id: 7,
        title: 'completed task 4',
        difficulty: 1,
        priority: taskPriority.low,
        completed: true,
        dueDate: new Date('07/10/2022'),
      },
      {
        id: 8,
        title: 'completed task 5',
        difficulty: 1,
        priority: taskPriority.low,
        completed: true,
        dueDate: new Date('07/11/2022'),
      },
      {
        id: 9,
        title: 'completed task old',
        difficulty: 1,
        priority: taskPriority.low,
        completed: true,
        dueDate: new Date('07/11/2000'),
      },
    ];
    fixture.nativeElement.querySelector('#taskShownBtn').click();
    fixture.nativeElement.querySelector('#taskShownAll').click();
    expect(component.completedTasks.shown.length).toBe(6);

    fixture.nativeElement.querySelector('#taskShownBtn').click();
    fixture.nativeElement.querySelector('#taskShown5').click();
    expect(component.completedTasks.shown.length).toBe(5);
  });

  it('should swap the sorting order of tasks on clicking the arrows', () => {
    // defaults to sorting by date, have to click once to swap to priority sort
    fixture.nativeElement.querySelector('#uncompletePrioritySort').click();
    expect(component.uncompletedTasks.all[0].priority).toBeLessThan(
      component.uncompletedTasks.all[1].priority
    );

    fixture.nativeElement.querySelector('#uncompletePrioritySort').click();
    expect(component.uncompletedTasks.all[0].priority).toBeGreaterThan(
      component.uncompletedTasks.all[1].priority
    );
  });
});
