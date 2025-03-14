import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error.component.html',
})
export class ErrorComponent {
  @Input() title = 'Ha ocurrido un error';
  @Input() message = 'Por favor, inténtalo de nuevo más tarde.';
}
