import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WhatsappButtonComponent } from '../whatsapp-button/whatsapp-button.component';
import { EmailService } from '../../services/email.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, WhatsappButtonComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  email = '';
  private _email = inject(EmailService);
  private _toastr = inject(ToastrService);

  onSubmit() {
    this._email.subscribe(this.email).subscribe({
      next: (res: { success: boolean; message: string }) => {
        if (res.success) {
          this._toastr.success(res.message); // Muestra el mensaje de éxito
        } else {
          this._toastr.error(res.message); // Muestra el mensaje de error
        }
      },
      error: (err) => {
        this._toastr.error('Algo salió mal!'); // Si hay algún error en la llamada
      },
    });
    this.email = ''; // Limpiar el campo de email después de enviar
  }
}
