import { Component, Input } from '@angular/core';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { FeedbackRequest } from '../../../../core/models/feedback.model';
import { Issuer } from '../../../../core/models/issuer.model';

@Component({
  selector: 'app-feedback-review',
  imports: [Card, Divider],
  templateUrl: './feedback-review.html',
  styleUrl: './feedback-review.scss',
})
export class FeedbackReview {
  @Input({ required: true }) payload!: FeedbackRequest;
  @Input({ required: true }) issuer!: Issuer;
  @Input() agreedDriverTitles: string[] = [];
  @Input() disagreedDriverTitles: string[] = [];
}
