import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
    severity: 'success' | 'info' | 'warn' | 'error';
    summary: string;
    detail?: string;
    life?: number;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private readonly _messages = signal<ToastMessage[]>([]);
    public readonly messages = this._messages.asReadonly();

    show(message: ToastMessage) {
        this._messages.update(msgs => [...msgs, message]);
    }

    success(summary: string, detail?: string, life: number = 3000) {
        this.show({ severity: 'success', summary, detail, life });
    }

    info(summary: string, detail?: string, life: number = 3000) {
        this.show({ severity: 'info', summary, detail, life });
    }

    warn(summary: string, detail?: string, life: number = 3000) {
        this.show({ severity: 'warn', summary, detail, life });
    }

    error(summary: string, detail?: string, life: number = 3000) {
        this.show({ severity: 'error', summary, detail, life });
    }

    clear() {
        this._messages.set([]);
    }
}
