export class AppUserAuth {
  id: number = 0;
  userName: string = "";
  password: string = "abc123";
  bearerToken: string = "";
  isAuthenticated: boolean = false;

  canAccessTasks: boolean = false;
  canCompleteTasks: boolean = false;
  canAddTasks: boolean = false;

  //these two have not been implemented yet
  //they will come when the factions/quests/companions pages are filled out
  canAccessWiki: boolean = false;
  canAddToWiki: boolean = false;
  canEditWiki: boolean = false;
}
