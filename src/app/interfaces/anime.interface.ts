import { Genres } from "../enums/genres.enum";

export interface Anime {
 id: number;
 title: string;
 genre: Genres;
 description?: string;
 isDeleted: boolean;
}