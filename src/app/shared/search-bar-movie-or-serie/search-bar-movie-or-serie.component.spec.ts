import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBarMovieOrSerieComponent } from './search-bar-movie-or-serie.component';

describe('SearchBarMovieOrSerieComponent', () => {
  let component: SearchBarMovieOrSerieComponent;
  let fixture: ComponentFixture<SearchBarMovieOrSerieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchBarMovieOrSerieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBarMovieOrSerieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
