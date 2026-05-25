import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Message } from 'primeng/message';
import { Card } from 'primeng/card';
import { RequiredAsteriskDirective } from '../../../../shared/directives/required-asterisk.directive';

@Component({
  selector: 'app-feedback-step-user',
  imports: [ReactiveFormsModule, InputText, Select, Message, Card, RequiredAsteriskDirective],
  templateUrl: './feedback-step-user.html',
  styleUrl: './feedback-step-user.scss',
})
export class FeedbackStepUser {
  @Input({ required: true }) group!: FormGroup;
  @Input() roleOptions: string[] = [];

  hasError(controlName: string): boolean {
    const control = this.group.get(controlName);
    return Boolean(control?.invalid && (control.dirty || control.touched));
  }
}
