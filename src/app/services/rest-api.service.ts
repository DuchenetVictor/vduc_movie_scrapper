import { mediaTypeEnum } from './../models/mediaTypeEnum';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  private baseUrl = "http://www.omdbapi.com/?apikey=";
  private baseUrlPoster = "http://img.omdbapi.com/";
  private apiKey = "75522b56";

  constructor(private httpClient: HttpClient) { }

  getMedias<T>(Title, mediaType: mediaTypeEnum, page?: Number): Observable<T> {
    if (page === undefined) page = 1;
    return this.httpClient.get<T>(this.baseUrl + this.apiKey + "&s=" + Title + "&page=" + page + "&type=" + mediaType);
  }

  getMedia<T>(imdbID, mediaType?: mediaTypeEnum, season?: String, episode?: String): Observable<T> {

    let seasonSearch: String;
    let episodeSearch: String;
    let mediaTypeSearch: mediaTypeEnum;
    ({ seasonSearch, episodeSearch, mediaTypeSearch } = this.addOptionalRequest(season, episode, mediaType));

    return this.httpClient.get<T>(this.baseUrl + this.apiKey + "&i=" + imdbID + mediaTypeSearch + seasonSearch + episodeSearch);
  }

  getPoster(imdb: string, high?: Number) {
    let highSearch: string = high != null ? "?h=" + high : "";
    return this.httpClient.get(this.baseUrlPoster + this.apiKey + "?i=" + imdb + highSearch);
  }

  addOptionalRequest(season: String, episode: String, mediaType: mediaTypeEnum): any {
    let seasonSearch: string;
    let episodeSearch: string;
    let mediaTypeSearch: String;

    seasonSearch = season != null ? seasonSearch = "&season=" + season : "";

    episodeSearch = episode != null ? "&episode=" + episodeSearch : "";

    mediaTypeSearch = mediaType != null ? "&type=" + mediaType : "";

    return { seasonSearch, episodeSearch, mediaTypeSearch };
  }
}