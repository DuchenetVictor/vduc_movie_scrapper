import { episode } from './episode';

export interface episodeResume {
    Title:        string;
    Season:       string;
    totalSeasons: string;
    Episodes:     episode[];
    Response:     string;
}
