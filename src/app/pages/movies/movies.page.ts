import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
})
export class MoviesPage implements OnInit {
  public isdisplaySearchBar: boolean;

  constructor() { }

  ngOnInit() {
    this.isdisplaySearchBar = true;
  }

  displaySearchBar() {
    this.isdisplaySearchBar = !this.isdisplaySearchBar;
  }

}
