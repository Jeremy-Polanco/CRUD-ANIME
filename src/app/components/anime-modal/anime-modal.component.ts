import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-anime-modal',
  standalone: true,
  imports: [],
  templateUrl: './anime-modal.component.html',
  styleUrl: './anime-modal.component.scss'
})
export class AnimeModalComponent {
  @Input() modalId: string = ''

}
