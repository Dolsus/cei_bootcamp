import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTaskEditComponent } from './dashboard-task-edit.component';

describe('DashboardTaskEditComponent', () => {
  let component: DashboardTaskEditComponent;
  let fixture: ComponentFixture<DashboardTaskEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardTaskEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardTaskEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
