import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';
import { AppUserAuth } from 'src/app/shared/security/app-user-auth';
import { UsersData } from 'src/app/shared/security/users-data';
import { DashboardTask, taskPriority } from './dashboard-task';

export class DashboardData implements InMemoryDbService {
  createDb(
    reqInfo?: RequestInfo | undefined
  ): {} | Observable<{}> | Promise<{}> {
    const tasks: DashboardTask[] = [
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
            title: "first subtask",
            difficulty: 1,
            priority: taskPriority.low,
            completed: false
          },
          {
            id: 1.2,
            title: "second subtask",
            difficulty: 1,
            priority: taskPriority.low,
            completed: false
          }
        ]
      },
      {
        id: 2,
        title: 'cool task',
        difficulty: 1,
        priority: taskPriority.low,
        completed: false,
        dueDate: new Date("2022-06-13")
      },
      {
        id: 3,
        title: 'next task',
        difficulty: 2,
        priority: taskPriority.standard,
        dueDate: new Date(),
        completed: false

      },
      {
        id: 4,
        title: 'completed task 1',
        difficulty: 1,
        priority: taskPriority.low,
        completed: true,
        dueDate: new Date('07/11/2022')
      },
      {
        id: 5,
        title: 'completed task 2',
        difficulty: 1,
        priority: taskPriority.low,
        completed: true,
        dueDate: new Date('07/11/2022')
      },
      {
        id: 6,
        title: 'completed task 3',
        difficulty: 1,
        priority: taskPriority.low,
        completed: true,
        dueDate: new Date('07/09/2022')
      },
      {
        id: 7,
        title: 'completed task 4',
        difficulty: 1,
        priority: taskPriority.low,
        completed: true,
        dueDate: new Date('07/10/2022')
      },
      {
        id: 8,
        title: 'completed task 5',
        difficulty: 1,
        priority: taskPriority.low,
        completed: true,
        dueDate: new Date('07/11/2022')
      },
      {
        id: 9,
        title: 'completed task old',
        difficulty: 1,
        priority: taskPriority.low,
        completed: true,
        dueDate: new Date('07/11/2000')
      },
      {
        id: 10,
        title: 'completed task new',
        difficulty: 1,
        priority: taskPriority.low,
        completed: true,
        dueDate: new Date()
      },
      {
        id: 11,
        title: 'completed task',
        difficulty: 1,
        priority: taskPriority.low,
        completed: true,
        dueDate: new Date('07/12/2022')
      },
      {
        id: 12,
        title: 'completed task',
        difficulty: 1,
        priority: taskPriority.low,
        completed: true,
        dueDate: new Date('07/13/2022')
      }
    ];

    const users: AppUserAuth[] = UsersData;

    return { tasks, users };
  }
}
