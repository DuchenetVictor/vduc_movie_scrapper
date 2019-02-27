import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-series',
  templateUrl: './series.page.html',
  styleUrls: ['./series.page.scss'],
})
export class SeriesPage implements OnInit {
  public isdisplaySearchBar: boolean;

  constructor() { }

  ngOnInit() {
    this.isdisplaySearchBar = true;
  }

  displaySearchBar() {
    this.isdisplaySearchBar = !this.isdisplaySearchBar;
  }

}
