import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './whatsapp-button.component.html',
  styleUrl: './whatsapp-button.component.css',
})
export class WhatsappButtonComponent {
  phoneNumber = '542364347125'; // Número de teléfono placeholder

  get whatsappLink(): string {
    return `https://wa.me/${this.phoneNumber}?text=Hola,%20quiero%20hablar%20con%20Faustino`;
  }
}
