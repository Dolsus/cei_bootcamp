import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { take } from 'rxjs';
import { SharedModule } from '../../shared.module';
import { AppUser } from '../app-user';
import { AppUserAuth } from '../app-user-auth';
import { SecurityService } from './security.service';

describe('SecurityService', () => {
  let service: SecurityService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let testUserList: AppUserAuth[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, RouterTestingModule],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(SecurityService);
    testUserList = [
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
    ];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get inital list of users with a GET HTTP req', () => {
    service.getUsers().subscribe((data: AppUser[]) => {
      expect(data).toBe(testUserList);
    });

    const req = httpTestingController.expectOne('api/users');
    expect(req.request.method).toBe('GET');

    req.flush(testUserList);
    httpTestingController.verify();
  });

  it('should clear the security object on logout', () => {
    const testSecurityOb: AppUserAuth = {
      id: 12,
      userName: 'wroot2',
      password: '123',
      bearerToken: 'a1231sdfj1kl1a123123sd123fjkl1',
      isAuthenticated: true,
      canAccessTasks: true,
      canCompleteTasks: true,
      canAddTasks: true,
      canAccessWiki: true,
      canAddToWiki: true,
      canEditWiki: true,
    };

    service.securityObj = { ...service.securityObj, ...testSecurityOb };
    service.logout();

    const resetUser: AppUserAuth = new AppUserAuth();
    for (let key in service.securityObj) {
      expect(service.securityObj[key as keyof typeof service.securityObj]).toBe(
        resetUser[key as keyof typeof resetUser]
      );
    }
  });
});
