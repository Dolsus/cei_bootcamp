import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, filter, Subject, Subscription } from 'rxjs';
import { SecurityService } from 'src/app/shared/security/services/security.service';
import { DashboardTask, taskPriority } from '../../services/dashboard-task';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'dash-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  sprintProgress = 0;
  taskPriority = taskPriority;
  caretProgress: string = '';
  startDate: Date = new Date();
  endDate: Date = new Date();
  startString: string = '06/27'; //these are defaults, could be empty/null
  endString: string = '07/11';
  sub!: Subscription;
  errMsg: string = '';
  idForModal: number | null = null;
  tasksShown: string = 'All';

  _tasks: DashboardTask[] = [];
  completedTasks: DashboardTask[] = [];
  completedTasksShown: DashboardTask[] = [];
  uncompletedTasks: DashboardTask[] = [];
  overdueTasks: DashboardTask[] = [];

  public set tasks(value: DashboardTask[]) {
    if (value != this._tasks) {
      this._tasks = value;
      this.updateTaskUI();
    }
  }
  public get tasks(): DashboardTask[] {
    return this._tasks;
  }

  constructor(
    private dashboardService: DashboardService,
    private securityService: SecurityService
  ) {}

  get securityObj() {
    return this.securityService.securityObj;
  }

  ngOnInit(): void {
    this.setSprintProgress(new Date('06/27/2022'));
    this.updateTasks();
  }

  updateTasks(): void {
    this.sub = this.dashboardService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: (err) => {
        this.errMsg = err;
        console.log(this.errMsg);
      },
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe;
  }

  filterCompleteTasks(completed: boolean): DashboardTask[] {
    //TODO: add "deleted" property and filter by that also
    return this.tasks.filter((task: DashboardTask) => {
      if (completed || !task.dueDate) {
        return task.completed === completed;
      }
      if (task.dueDate) {
        var taskDueDate: Date = new Date(task.dueDate);
        return (
          task.completed === completed &&
          this.startDate.getTime() <= taskDueDate.getTime() &&
          taskDueDate.getTime() <= this.endDate.getTime()
        );
      }
      return task.completed === completed;
    });
  }

  filterOverdueTasks(): DashboardTask[] {
    //TODO: add "deleted" property and filter by that also
    return this.tasks.filter((task: DashboardTask) => {
      if (task.dueDate) {
        var taskDueDate: Date = new Date(task.dueDate);
        return (
          task.completed === false &&
          taskDueDate.getTime() <= this.startDate.getTime()
        );
      }
      return false;
    });
  }

  setSprintProgress(startDate: Date) {
    var diff: number = this.daysSince(startDate);
    while (diff >= 14) {
      startDate.setDate(startDate.getDate() + 14);
      diff = this.daysSince(startDate);
    }
    this.startDate = startDate;

    const ms_per_two_weeks = 86400000 * 13;
    this.endDate = new Date(startDate.getTime() + ms_per_two_weeks);

    this.sprintProgress = Number(((diff * 100) / 14).toFixed(1));
    this.caretProgress = 'calc(' + this.sprintProgress.toString() + '% - 5px)';

    this.startString = `${
      startDate.getMonth() + 1
    }/${startDate.getDate()}/${startDate.getFullYear()}`;
    this.endString = `${
      this.endDate.getMonth() + 1
    }/${this.endDate.getDate()}/${this.endDate.getFullYear()}`;
  }

  daysSince(startDate: Date): number {
    var diff: number = Math.abs(startDate.getTime() - new Date().getTime());
    diff = Math.floor(diff / (1000 * 3600 * 24));
    return diff;
  }

  changeTaskCompleteStatus(id: number): void {
    var task: DashboardTask | undefined = this.tasks.find(
      (task: DashboardTask) => {
        return task.id === id - (id % 1);
      }
    );
    //if number is a decimal (it's a subtask)
    if (id % 1 != 0 && task) {
      //then the first task grabbed will be the parent task.
      task = task.subTasks.find((subtask: DashboardTask) => {
        return subtask.id === id;
      });
    }

    if (!task) {
      //if after all that there's no task, something is wrong.
      this.errMsg = `task with id ${id} not found.`;
      console.log(this.errMsg);
      return;
    } else {
      task.completed = !task.completed;
      this.dashboardService.updateTask(task).subscribe({
        error: (err) => {
          this.errMsg = err;
          console.log(err);
        },
      });
      this.updateTaskUI();
    }
  }

  updateTaskUI(): void {
    this.uncompletedTasks = this.filterCompleteTasks(false);
    this.overdueTasks = this.filterOverdueTasks();
    this.completedTasks = this.filterCompleteTasks(true).sort((a, b) => {
      return <any>new Date(b.dueDate) - <any>new Date(a.dueDate);
    });
    this.changeNumTasksViewed(this.tasksShown);
  }

  setIdForModal(id: number | null): void {
    this.idForModal = id;
  }

  changeNumTasksViewed(numTasks: string): void {
    if (this.tasksShown == numTasks) {
      if (this.completedTasksShown.length < 1) {
        this.completedTasksShown = this.completedTasks.map((x) => x);
      }
      return;
    }

    this.tasksShown = numTasks;
    if (numTasks !== 'All') {
      var tasksToSee: number = Number(numTasks);

      this.completedTasksShown = this.completedTasksShown
        .slice(0, tasksToSee)
        .map((x) => x);
    } else {
      if (!this.checkDateOrder(this.completedTasksShown)) {
        this.completedTasksShown = this.completedTasks.reverse().map((x) => x);
      } else {
        this.completedTasksShown = this.completedTasks.map((x) => x);
      }
    }
  }

  swapDateSort(list: DashboardTask[]) {
    if (this.checkDateOrder(list)) {
      list = list.sort((a, b) => {
        return <any>new Date(a.dueDate) - <any>new Date(b.dueDate);
      });
    } else {
      list = list
        .sort((a, b) => {
          return <any>new Date(b.dueDate) - <any>new Date(a.dueDate);
        })
        .map((x) => x);
    }
  }

  checkDateOrder(list: DashboardTask[]): boolean {
    list[0].dueDate = new Date(list[0].dueDate);

    list[list.length - 1].dueDate = new Date(list[list.length - 1].dueDate);

    return list[0].dueDate > list[list.length - 1].dueDate;
  }
}
