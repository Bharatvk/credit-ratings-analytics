import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Message } from 'primeng/message';

@Component({
  selector: 'app-error-state',
  imports: [Message, ButtonDirective],
  templateUrl: './error-state.html',
  styleUrl: './error-state.scss',
})
export class ErrorState {
  @Input() message = 'Something went wrong. Please try again.';
  @Input() retryLabel = 'Retry';
  @Output() retry = new EventEmitter<void>();
}
