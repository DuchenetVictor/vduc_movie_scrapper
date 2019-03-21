import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api/rest-api.service';
import { MediaTypeEnum } from 'src/app/models/mediaTypeEnum';
import { EpisodeResume } from 'src/app/models/episodeResume';
import { Episode } from 'src/app/models/episode';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-season-details',
  templateUrl: './season-details.page.html',
  styleUrls: ['./season-details.page.scss'],
})
export class SeasonDetailsPage implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private restApi: RestApiService) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.imdb = params['imdb'];
      this.seasonNbr = params['seasonNbr'];
    });
  }

  private imdb: string;
  private seasonNbr: string;
  public episodeResume: EpisodeResume;
  public episodes: Episode[];

  ngOnInit() {


    this.restApi.getMedia<EpisodeResume>(this.imdb, MediaTypeEnum.episode, this.seasonNbr).subscribe(
      (res) => {
        this.episodeResume = res;
        this.episodes = res.Episodes;
      },
      (err) => {
        console.error(err);
      }
    );
  }

}
