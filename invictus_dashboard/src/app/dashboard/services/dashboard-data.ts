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
        completed: false
      },
      {
        id: 4,
        title: 'completed task',
        difficulty: 1,
        priority: taskPriority.low,
        completed: true
      }
    ];

    const users: AppUserAuth[] = UsersData;

    return { tasks, users };
  }
}
