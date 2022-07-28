import { AppUserAuth } from './app-user-auth';

export const UsersData: AppUserAuth[] = [
  {
    id: 0,
    userName: 'guest',
    password: '123',
    bearerToken: 'qwertyuiopqwer',
    isAuthenticated: true,
    canAccessTasks: true,
    canCompleteTasks: false,
    canAddTasks: false,
    canAccessWiki: false,
    canAddToWiki: false,
    canEditWiki: false,
  },
  {
    id: 1,
    userName: 'wren',
    password: '123',
    bearerToken: 'asdfjkl1asdfjkl1',
    isAuthenticated: true,
    canAccessTasks: true,
    canCompleteTasks: true,
    canAddTasks: true,
    canAccessWiki: false,
    canAddToWiki: false,
    canEditWiki: false,
  },
  {
    id: -4,
    userName: 'wroot',
    password: '123',
    bearerToken: 'a1231sdfj1kl1a123123sd123fjkl1',
    isAuthenticated: true,
    canAccessTasks: true,
    canCompleteTasks: true,
    canAddTasks: true,
    canAccessWiki: true,
    canAddToWiki: true,
    canEditWiki: true,
  }
];
