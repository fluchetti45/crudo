import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  onSubmit() {
    // Aquí iría la lógica para manejar el envío del formulario
    console.log('Formulario enviado:', this.contactForm);
    // Resetear el formulario después de enviar
    this.contactForm = {
      name: '',
      email: '',
      subject: '',
      message: '',
    };
  }
}
