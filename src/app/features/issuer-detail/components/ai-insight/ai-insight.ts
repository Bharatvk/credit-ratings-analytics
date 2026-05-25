import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Card } from 'primeng/card';
import { ProgressBar } from 'primeng/progressbar';
import { AIInsight } from '../../../../core/models/issuer.model';

@Component({
  selector: 'app-ai-insight',
  imports: [Card, ProgressBar, DatePipe],
  templateUrl: './ai-insight.html',
  styleUrl: './ai-insight.scss',
})
export class AiInsight {
  @Input({ required: true }) insight!: AIInsight;
}
