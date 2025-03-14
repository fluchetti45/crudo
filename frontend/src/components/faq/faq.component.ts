import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css',
})
export class FaqComponent {
  faqItems = [
    {
      question: '¿Cuáles son los métodos de pago aceptados?',
      answer:
        'Aceptamos tarjetas de crédito (Visa, MasterCard, American Express), PayPal y transferencias bancarias.',
    },
    {
      question: '¿Cuál es el tiempo de entrega estimado?',
      answer:
        'El tiempo de entrega varía según su ubicación, pero generalmente es de 3 a 7 días hábiles para envíos nacionales y de 7 a 14 días para envíos internacionales.',
    },
    {
      question: '¿Puedo devolver un producto?',
      answer:
        'Sí, ofrecemos devoluciones dentro de los 30 días posteriores a la compra. El producto debe estar sin usar y en su embalaje original.',
    },
    {
      question: '¿Ofrecen envío gratuito?',
      answer:
        'Sí, ofrecemos envío gratuito en pedidos superiores a $50 para envíos nacionales.',
    },
    {
      question: '¿Cómo puedo rastrear mi pedido?',
      answer:
        'Una vez que su pedido haya sido enviado, recibirá un correo electrónico con un número de seguimiento y un enlace para rastrear su paquete.',
    },
  ];
}
