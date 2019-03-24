import { PlotEnum } from './../../models/PlotEnum';
import { MediaTypeEnum } from '../../models/mediaTypeEnum';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  private baseUrl = 'http://www.omdbapi.com/?apikey=';
  private apiKey = '75522b56';
  private baseUrlPoster = 'http://img.omdbapi.com/';

  constructor(private httpClient: HttpClient) {}

  getMedias<T>(Title, mediaType: MediaTypeEnum, page?: Number): Observable<T> {
    if (page === undefined) {
      page = 1;
    }
    return this.httpClient.get<T>(
      this.baseUrl +
        this.apiKey +
        '&s=' +
        Title +
        '&page=' +
        page +
        '&type=' +
        mediaType
    );
  }

  getposterLink(imdbId: string, size?: string): string {
    const url: string = this.baseUrlPoster
      .concat('?i=')
      .concat(imdbId)
      .concat('&apikey=')
      .concat(this.apiKey);
    if (size !== null && size !== undefined) {
      url.concat('&h=').concat(size);
    }
    return url;
  }
  getMedia<T>(
    imdbID,
    mediaType?: MediaTypeEnum,
    season?: String,
    episode?: String,
    plot?: PlotEnum
  ): Observable<T> {
    let seasonSearch: String;
    let episodeSearch: String;
    let mediaTypeSearch: MediaTypeEnum;
    let plotSearch: String;
    ({
      seasonSearch,
      episodeSearch,
      mediaTypeSearch,
      plotSearch
    } = this.addOptionalRequest(season, episode, mediaType, plot));
    console.log(plotSearch);
    return this.httpClient.get<T>(
      this.baseUrl +
        this.apiKey +
        '&i=' +
        imdbID +
        mediaTypeSearch +
        seasonSearch +
        episodeSearch +
        plotSearch
    );
  }

  getPoster(imdb: string, high?: Number) {
    const highSearch: string = high != null ? '?h=' + high : '';
    return this.httpClient.get(
      this.baseUrlPoster + this.apiKey + '?i=' + imdb + highSearch
    );
  }

  addOptionalRequest(
    season: String,
    episode: String,
    mediaType: MediaTypeEnum,
    typeOfPlot: PlotEnum
  ): any {
    let seasonSearch: string;
    let episodeSearch: string;
    let mediaTypeSearch: String;
    let plot: String;

    seasonSearch = season != null ? (seasonSearch = '&season=' + season) : '';

    episodeSearch = episode != null ? '&episode=' + episodeSearch : '';

    mediaTypeSearch = mediaType != null ? '&type=' + mediaType : '';

    plot =
      typeOfPlot != null
        ? '&plot='.concat(typeOfPlot)
        : '&plot='.concat(PlotEnum.short);
console.log(plot);
    return { seasonSearch, episodeSearch, mediaTypeSearch, plot };
  }
}
