import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { initFlowbite } from 'flowbite';
import { FormModalComponent } from './components/form-modal/form-modal.component';
import { Anime } from './interfaces/anime.interface';
import { AnimeService } from './services/anime/anime.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Genres } from './enums/genres.enum';
import { AnimeModalComponent } from './components/anime-modal/anime-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, MatIconModule, FormModalComponent, ReactiveFormsModule, AnimeModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  @ViewChild('openModalButton') openModalButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('openShowAnimeModalButton') openShowAnimeModalButton?: ElementRef<HTMLButtonElement>;
  filtersForm: FormGroup = new FormGroup({
    title: new FormControl(""),
    genre: new FormControl("")
  })
  title = 'crud-unipago';
  animes: Anime[][] = []
  genres = Object.values(Genres);
  tableColumns: string[] = ['Título', 'Género', 'Descripción', 'Acciones']
  numberOfPages = 0
  currentPage = 1;
  totalItems = 0;

  constructor(private animeService: AnimeService,
  ) { }

  ngOnInit() {
    initFlowbite();
    this.animeService.animes.subscribe((animes: Anime[]) => {
      this.filterAnimes()
    })
  }

  deleteAnime(id: number) {
    this.animeService.delete(id);
  }

  selectAnime(anime: Anime) {
    this.animeService.selectAnime(anime)
    this.openModalButton?.nativeElement.click()
  }

  onPageChange(page: number) {
    this.currentPage = page
  }

  filterAnimes(e?: SubmitEvent) {
    e?.preventDefault();

    const filterTitle = this.filtersForm.value.title;
    const filterGenre = this.filtersForm.value.genre;

    const allAnimes = this.animeService.get()

    if (!filterTitle && !filterGenre) {
      this.handleAnimePagination(allAnimes)
    }

    const filteredAnimes = allAnimes.filter(anime => {
      let isValid = false;

      isValid = filterTitle ? anime.title.toLowerCase().includes(filterTitle.toLowerCase()) : true;
      isValid = filterGenre ? anime.genre === filterGenre && isValid : isValid;

      return isValid
    })

    this.handleAnimePagination(filteredAnimes)
  }

  showAnime() {
    this.openShowAnimeModalButton?.nativeElement.click()
  }

  handleAnimePagination(animes: Anime[]) {
    this.totalItems = animes.length;

    const numberOfPages = Math.ceil(animes.length / 10)

    const paginatedAnimes = Array.from({ length: numberOfPages }, (_, index) => {
      return animes.slice((index) * 10, (index + 1) * 10)
    })

    this.animes = paginatedAnimes

    if (!paginatedAnimes[this.currentPage - 1] && this.currentPage > 1) {
      this.currentPage = this.currentPage - 1
    }

    this.numberOfPages = numberOfPages
  }

}
