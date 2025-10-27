import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CardModule,
        InputTextModule,
        InputTextareaModule,
        ButtonModule
    ]
})
export class ContactComponent {
    contactForm: FormGroup;
    private readonly toastService = inject(ToastService);

    constructor(private fb: FormBuilder) {
        this.contactForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            message: ['', [Validators.required, Validators.maxLength(300)]]
        });
    }

    get email() {
        return this.contactForm.get('email');
    }

    get message() {
        return this.contactForm.get('message');
    }

    get messageLength(): number {
        return this.message?.value?.length || 0;
    }

    onSubmit() {
        if (this.contactForm.valid) {
            console.log('Contact form submitted:', this.contactForm.value);
            this.toastService.success('Demande de contact envoyée avec succès.', 'Nous vous répondrons bientôt.');
            this.resetForm();
        }
    }

    resetForm() {
        this.contactForm.reset({
            email: '',
            message: ''
        });
    }
}
