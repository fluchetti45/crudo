import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-returns',
  templateUrl: './returns.component.html',
  styleUrls: ['./returns.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ReturnsComponent {
  // Preguntas frecuentes sobre devoluciones
  faqs = [
    {
      question: '¿Cuál es el plazo para realizar una devolución?',
      answer:
        'Tienes hasta 30 días después de recibir tu pedido para solicitar una devolución. El producto debe estar sin usar y en su empaque original.',
    },
    {
      question: '¿Cómo inicio el proceso de devolución?',
      answer:
        'Para iniciar una devolución, ingresa a tu cuenta y selecciona el pedido que deseas devolver. También puedes contactarnos por WhatsApp o email para asistencia personalizada.',
    },
    {
      question: '¿Cuánto tarda el reembolso?',
      answer:
        'Una vez recibido y verificado el producto, procesaremos tu reembolso en 3-5 días hábiles. El tiempo de acreditación dependerá de tu banco o método de pago original.',
    },
    {
      question: '¿Quién paga el envío de la devolución?',
      answer:
        'Si la devolución es por un defecto del producto o error nuestro, nosotros cubrimos el costo del envío. En otros casos, el costo del envío corre por cuenta del cliente.',
    },
  ];
}
