import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Card } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { RatingHistory as RatingHistoryModel } from '../../../../core/models/issuer.model';

@Component({
  selector: 'app-rating-history',
  imports: [Card, TableModule, DatePipe, Tag],
  templateUrl: './rating-history.html',
  styleUrl: './rating-history.scss',
})
export class RatingHistory {
  @Input() history: RatingHistoryModel[] = [];

  severity(action: RatingHistoryModel['action']): 'success' | 'danger' | 'info' {
    if (action === 'Upgrade') {
      return 'success';
    }
    if (action === 'Downgrade') {
      return 'danger';
    }
    return 'info';
  }
}
