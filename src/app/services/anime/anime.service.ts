import { Injectable } from '@angular/core';
import { Anime } from '../../interfaces/anime.interface';
import { BehaviorSubject } from 'rxjs';
import filterDeletedAnimes from '../../utils/filterDeletedAnimes';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {
  selectedAnime = new BehaviorSubject<Anime | null>(null)
  animes = new BehaviorSubject<Anime[]>([])

  constructor() {
    const animes = localStorage.getItem('animes')
    if (animes) {
      this.animes = new BehaviorSubject<Anime[]>(filterDeletedAnimes((JSON.parse(animes) || []).filter((anime: Anime) => !anime.isDeleted)))
    }
  }

  get() {
    return filterDeletedAnimes(this.animes.value)
  }

  add(anime: Anime): void {
    this.animes.next([...this.animes.value, { ...anime, id: new Date().getTime(), isDeleted: false }])
    localStorage.setItem('animes', JSON.stringify(this.animes.value))
  }

  delete(id: number): void {
    const filteredAnimes = this.animes.value.map((anime) => {
      if (anime.id === id) {
        return { ...anime, isDeleted: true }
      }

      return anime
    })

    this.animes.next(filteredAnimes)
    localStorage.setItem('animes', JSON.stringify(this.animes.value))
  }

  edit(editedAnime: Anime): void {
    const newAnimes = this.animes.value.map((anime) => anime.id !== editedAnime.id ? anime : editedAnime)
    this.animes.next(newAnimes)
    localStorage.setItem('animes', JSON.stringify(newAnimes))
  }

  selectAnime(anime: Anime): void {
    this.selectedAnime.next(anime)
  }

}
