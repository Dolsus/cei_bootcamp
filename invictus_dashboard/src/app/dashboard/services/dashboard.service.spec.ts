import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DashboardTask, taskPriority } from './dashboard-task';
import { DashboardService } from './dashboard.service';

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { DashboardData } from './dashboard-data';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  let testTaskList: DashboardTask[] = [
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

    service = new DashboardService(httpClient);
  });

  it('should have no modified tasks at start', () => {
    expect(service.lastTaskModified).toBeUndefined();
  });

  it('should get initial list of tasks with a GET HTTP req', () => {
    service.getTasks().subscribe({
      next: (data: DashboardTask[]) => {
        expect(data).toBe(testTaskList);
        expect(data.length).toBe(4);
      },
    });

    const req = httpTestingController.expectOne('api/tasks');
    expect(req.request.method).toBe('GET');

    //this is the response from the database (the mock data)
    req.flush(testTaskList);
    httpTestingController.verify();
  });

  it('should get a specified task with a GET HTTP req', () => {
    service.getTask(1).subscribe({
      next: (data: DashboardTask) => {
        expect(data).toBe(testTaskList[0]);
      },
    });

    const req = httpTestingController.expectOne('api/tasks/1');
    expect(req.request.method).toBe('GET');

    //this is the response from the database (the mock data)
    req.flush(testTaskList[0]);
    httpTestingController.verify();
  });

  it('should update a specified task with a PUT HTTP req', () => {
    const taskToUpdate: DashboardTask = {
      id: 2,
      title: 'updatedTitle',
      difficulty: 1,
      priority: taskPriority.low,
      completed: false,
      dueDate: new Date('06/14/2022'),
    };
    service.updateTask(taskToUpdate).subscribe({
      next: (data) => {
        expect(data.title).toBe('updatedTitle');
      },
    });
    const req = httpTestingController.expectOne('api/tasks/2');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toBe(taskToUpdate);
    req.flush(taskToUpdate);
    httpTestingController.verify();
  });

  it('should create a task with a POST HTTP req', () => {
    const taskToCreate: DashboardTask = {
      id: 5,
      title: 'completed task 2',
      difficulty: 2,
      priority: taskPriority.low,
      completed: true,
      dueDate: new Date('07/10/2022'),
    };
    service.createTask(taskToCreate).subscribe({
      next: (task) => {
        expect(task.title).toBe('completed task 2');
      },
    });

    const req = httpTestingController.expectOne('api/tasks');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(taskToCreate);
    req.flush(taskToCreate);
    httpTestingController.verify();
  });

  it('should delete a specified task with a DELETE HTTP req', () => {
    service.deleteTask(1).subscribe({
      next: (data) => {
        expect(data).toBe(1);
      },
    });

    const req = httpTestingController.expectOne('api/tasks/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(1);
    httpTestingController.verify();
  });
});
