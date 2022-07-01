import { splitNsName } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dash-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  sprint_progress = '0';
  start_string:string = "06/27";
  end_string:string = "07/11"

  constructor() {}

  ngOnInit(): void {
    this.set_sprint_progress(new Date("06/27/2022"));
  }

  set_sprint_progress(start_date: Date) {
    var diff:number = this.days_since(start_date);
    while(diff > 14){
      start_date.setDate(start_date.getDate() + 14);
      diff = this.days_since(start_date);
    }

    const ms_per_two_weeks = 86400000 * 14;
    var end_date:Date = new Date(start_date.getTime() + ms_per_two_weeks);

    this.sprint_progress = (diff * 100 / 14).toFixed(1);

    this.start_string = `${start_date.getMonth() + 1}/${start_date.getDate()}`;
    this.end_string = `${end_date.getMonth() + 1 }/${end_date.getDate()}`;
  }

  days_since(start_date: Date): number{
    var diff: number = Math.abs(start_date.getTime() - new Date().getTime());
      diff = Math.ceil(diff / (1000 * 3600 * 24));
    return diff;
  }
}
