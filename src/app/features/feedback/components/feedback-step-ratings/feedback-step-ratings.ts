import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { Message } from 'primeng/message';
import { Card } from 'primeng/card';
import { RequiredAsteriskDirective } from '../../../../shared/directives/required-asterisk.directive';

@Component({
  selector: 'app-feedback-step-ratings',
  imports: [ReactiveFormsModule, RatingModule, Message, Card, RequiredAsteriskDirective],
  templateUrl: './feedback-step-ratings.html',
  styleUrl: './feedback-step-ratings.scss',
})
export class FeedbackStepRatings {
  @Input({ required: true }) group!: FormGroup;

  hasError(controlName: string): boolean {
    const control = this.group.get(controlName);
    return Boolean(control?.invalid && (control.touched || control.dirty));
  }
}
