import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError, tap, map, of } from 'rxjs';
import { DashboardTask, taskPriority } from './dashboard-task';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private dashboardDataUrl = 'api/tasks';
  public lastTaskModified?: DashboardTask;

  constructor(private http: HttpClient) {}

  handleError(err: HttpErrorResponse) {
    let errMsg = '';
    if (err.error instanceof ErrorEvent) {
      //client-side or network error
      errMsg = `An error occured: ${err.error.message}`;
    } else {
      //backend error
      errMsg = `Server returned code: ${err.status}, with error: ${err.message}`;
    }
    console.log(errMsg);

    return throwError(() => errMsg);
  }

  getTasks(): Observable<DashboardTask[]> {
    return this.http.get<DashboardTask[]>(this.dashboardDataUrl).pipe(
      // tap((data) => console.log(`Got tasks: ${JSON.stringify(data)}`)),
      catchError(this.handleError)
    );
  }

  getTask(id: number): Observable<DashboardTask> {
    if (id == 0) {
      return of(this.initTask());
    }

    const url = `${this.dashboardDataUrl}/${id}`;
    return this.http.get<DashboardTask>(url).pipe(
      tap((data) =>{}), //console.log(`Got task: ${JSON.stringify(data)}`)),
      catchError(this.handleError)
    );
  }

  initTask(): DashboardTask {
    return {
      id: 0,
      title: '',
      difficulty: 1,
      priority: taskPriority.standard,
      completed: false,

      description: '',
      startDate: new Date(),
      dueDate: new Date(),
    };
  }

  updateTask(task: DashboardTask) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.dashboardDataUrl}/${task.id}`;

    return this.http.put<DashboardTask>(url, task, { headers: headers }).pipe(
      tap(() => {
        console.log(`Updating... id ${task.id} changed.`);
        this.lastTaskModified = task;
      }),
      map(() => task),
      catchError(this.handleError)
    );
  }

  createTask(task: DashboardTask) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    //set to null so that the api will set the id
    task.id = null;

    return this.http
      .post<DashboardTask>(this.dashboardDataUrl, task, { headers: headers })
      .pipe(
        tap((data) => {
          console.log(`Created task: ${JSON.stringify(data)}`);
          this.lastTaskModified = data;
        }),
        catchError(this.handleError)
      );
  }

  deleteTask(id: number): Observable<{}> {
    //TODO: add "deleted" property instead of actually deleting
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    const url = `${this.dashboardDataUrl}/${id}`;

    return this.http.delete<DashboardTask>(url, {headers: headers});
  }
}
