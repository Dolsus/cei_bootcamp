import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from './shared/security/services/security.service';

@Component({
  selector: 'dash-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'invictus_dashboard';
  atTop: boolean = true;
  navBarHeight: number = 0;

  get security() {
    return this.securityService.securityObj;
  }

  @ViewChild('navbar', { read: ElementRef })
  navbarElement!: ElementRef<HTMLElement>;
  @ViewChild('banner', { read: ElementRef })
  bannerElement!: ElementRef<HTMLElement>;

  constructor(
    private securityService: SecurityService,
    private router: Router
  ) {}

  logout() {
    this.securityService.logout();
    this.router.navigate(['/home']);
  }

  onScroll(event: any) {
    this.atTop =
      window.scrollY - this.bannerElement.nativeElement.clientHeight < 0;
    if (!this.atTop) {
      if (this.navbarElement) {
        this.navBarHeight = this.navbarElement.nativeElement.clientHeight;
      }
    } else {
      this.navBarHeight = 0;
    }
  }
}
