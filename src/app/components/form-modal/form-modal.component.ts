import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Anime } from '../../interfaces/anime.interface';
import { Genres } from '../../enums/genres.enum';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { AnimeService } from '../../services/anime/anime.service';

@Component({
  selector: 'app-form-modal',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule],
  templateUrl: './form-modal.component.html',
  styleUrl: './form-modal.component.scss'
})
export class FormModalComponent implements OnInit {
  @Input() modalId: string = ''
  anime: Anime | null = null;
  @ViewChild('closeButton') closeButton?: ElementRef<HTMLButtonElement>;

  animeForm: FormGroup = new FormGroup({
    title: new FormControl("", [Validators.required]),
    genre: new FormControl("", [Validators.required]),
    description: new FormControl("")
  })
  genres = Object.values(Genres);

  constructor(private animeService: AnimeService) { }

  ngOnInit(): void {
    this.animeService.selectedAnime.subscribe((selectedAnime) => {
      if (!selectedAnime) {
        this.anime = null;
        this.animeForm.reset()
        return
      }

      this.anime = selectedAnime
      this.animeForm.reset(selectedAnime)
    })
  }

  handleSubmit(): void {
    if (!this.animeForm.controls['title'].valid || !this.animeForm.controls['genre'].valid) return

    if (this.anime) {
      this.animeService.edit({ ...this.animeForm.value, isDeleted: this.anime.isDeleted, id: this.anime.id })
    } else {
      this.animeService.add(this.animeForm.value)
    }
    this.animeService.selectedAnime.next(null)
    this.clearForm()
    this.closeButton?.nativeElement.click()
  }

  clearForm(): void {
    this.animeForm.reset()
  }

}
