import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { mediaTypeEnum } from '../models/mediaTypeEnum';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  private baseUrl = "http://www.omdbapi.com/?apikey=";
  private apiKey = "75522b56";
 
  constructor(private httpClient: HttpClient) { }

  getMedias<T>(Title, mediaType: mediaTypeEnum, page?: 1): Observable<T> {
    return this.httpClient.get<T>(this.baseUrl + this.apiKey + "&s=" + Title + "&page=" + page + "&type=" + mediaType);
  }

  getMedia<T>(imdbID, mediaType: mediaTypeEnum, season?: String, episode?: String): Observable<T> {

    let seasonSearch: String;
    let episodeSearch: String;
    ({ seasonSearch, episodeSearch } = newFunction(season, seasonSearch, episode, episodeSearch));

    return this.httpClient.get<T>(this.baseUrl + this.apiKey + "&i=" + imdbID + "&type=" + mediaType + seasonSearch +episodeSearch);
  }
 
}
function newFunction(season: String, seasonSearch: String, episode: String, episodeSearch: String) {
  if (season != null) {
    seasonSearch = "&season=" + season;
  }
  else {
    seasonSearch = "";
  }
  if (episode != null) {
    episodeSearch = "&episode=" + episodeSearch;
  }
  else {
    episodeSearch = "";
  }
  return { seasonSearch, episodeSearch };
}