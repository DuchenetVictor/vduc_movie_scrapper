import { episode } from './episode';
import { searchable } from "./searchable";

export interface episodeResume extends searchable {
    Title:        string;
    Season:       string;
    totalSeasons: string;
    Episodes:     episode[];
    Response:     string;
}
