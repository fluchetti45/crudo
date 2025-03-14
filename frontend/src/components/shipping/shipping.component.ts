import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shipping',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.css'],
})
export class ShippingComponent {
  shippingMethods = [
    {
      name: 'Estándar',
      time: '3-5 días hábiles',
      price: 'Gratis en compras superiores a $50',
      icon: 'bi-truck',
    },
    {
      name: 'Express',
      time: '1-2 días hábiles',
      price: '$9.99',
      icon: 'bi-lightning-charge',
    },
    {
      name: 'Same Day',
      time: 'El mismo día (antes de las 2 PM)',
      price: '$14.99',
      icon: 'bi-stopwatch',
    },
    {
      name: 'Pickup',
      time: 'Recoge cuando quieras',
      price: 'Gratis',
      icon: 'bi-shop',
    },
  ];

  coverageAreas = [
    {
      zone: 'Zona Metropolitana',
      time: '1-3 días hábiles',
      icon: 'bi-building',
    },
    {
      zone: 'Ciudades Principales',
      time: '2-4 días hábiles',
      icon: 'bi-geo-alt',
    },
    {
      zone: 'Resto del País',
      time: '3-5 días hábiles',
      icon: 'bi-map',
    },
    {
      zone: 'Zonas Rurales',
      time: '5-7 días hábiles',
      icon: 'bi-tree',
    },
  ];

  faqs = [
    {
      question: '¿Cómo puedo hacer seguimiento a mi pedido?',
      answer:
        "Una vez que tu pedido sea enviado, recibirás un correo electrónico con el número de seguimiento y un enlace para rastrear tu paquete en tiempo real. También puedes acceder a esta información desde tu cuenta en la sección 'Mis Pedidos'.",
    },
    {
      question: '¿Qué sucede si no estoy en casa cuando llegue mi pedido?',
      answer:
        'Si no estás en casa, el repartidor dejará una notificación con instrucciones para programar una nueva entrega o recoger tu paquete en un punto de entrega cercano. Generalmente, se realizarán hasta 3 intentos de entrega antes de devolver el paquete a nuestro almacén.',
    },
    {
      question: '¿Realizan envíos internacionales?',
      answer:
        'Sí, realizamos envíos internacionales a más de 50 países. Los tiempos de entrega y costos varían según el destino. Puedes verificar la disponibilidad y costos para tu país durante el proceso de compra.',
    },
    {
      question: '¿Cómo se calculan los costos de envío?',
      answer:
        'Los costos de envío se calculan en base al peso, dimensiones del paquete y la distancia de entrega. Ofrecemos envío gratuito en pedidos nacionales superiores a $50. Puedes ver el costo exacto de envío antes de finalizar tu compra.',
    },
    {
      question: '¿Qué debo hacer si mi pedido llega dañado?',
      answer:
        'Si tu pedido llega dañado, toma fotos del paquete y del producto dañado, y contáctanos dentro de las 48 horas posteriores a la recepción. Nuestro equipo de atención al cliente te ayudará a resolver el problema rápidamente.',
    },
  ];
}
