export enum taskPriority{
  high,
  standard,
  low
}

export interface DashboardTask{
  id: number;
  title: string;
  difficulty: number;
  priority: taskPriority;
  completed: boolean; //if task completed, don't show in dashboard, maybe show in another section?

  description?: string;
  startDate?: Date; //only the main task will have a start date - probably not sub-tasks
  dueDate?: Date;
  subTasks?: DashboardTask[];
}
