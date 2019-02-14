import { Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api.service';
import { mediaTypeEnum } from 'src/app/models/mediaTypeEnum';
import { episodeResume } from 'src/app/models/episodeResume';
import { episode } from 'src/app/models/episode';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-season-details',
  templateUrl: './season-details.page.html',
  styleUrls: ['./season-details.page.scss'],
})
export class SeasonDetailsPage implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private restApi: RestApiService) { 
    this.activatedRoute.queryParams.subscribe(params => {
      this.imdb = params["imdb"];
      this.seasonNbr = params["seasonNbr"];
  });
  }

  private imdb: string;
  private seasonNbr: string;
  public episodeResume: episodeResume;
  public episodes: episode[];

  ngOnInit() {
   

    this.restApi.getMedia<episodeResume>(this.imdb, mediaTypeEnum.episode, this.seasonNbr).subscribe(
      (res) => {
        this.episodeResume = res;
        this.episodes = res.Episodes;
      },
      (err) => {
        console.log(err);
      }
    )
  }

}
