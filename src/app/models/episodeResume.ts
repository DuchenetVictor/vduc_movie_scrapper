import { Episode } from './episode';

export interface EpisodeResume {
    Title:        string;
    Season:       string;
    totalSeasons: string;
    Episodes:     Episode[];
    Response:     string;
}
