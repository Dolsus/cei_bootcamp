import { Component } from '@angular/core';

@Component({
  selector: 'dash-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'invictus_dashboard';
  atTop: boolean = true;

  onScroll(event: any){
    this.atTop = window.scrollY - 115 <= 0;
    //find some way to not have 115 (height of image at top) be fixed
    }

}
