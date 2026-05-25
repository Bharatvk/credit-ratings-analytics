import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { ButtonDirective } from 'primeng/button';
import { Issuer } from '../../../../core/models/issuer.model';
import { SortEvent } from 'primeng/api';

@Component({
  selector: 'app-issuer-table',
  imports: [TableModule, Tag, ButtonDirective, DatePipe, NgClass],
  templateUrl: './issuer-table.html',
  styleUrl: './issuer-table.scss',
})
export class IssuerTable {
  @Input() issuers: Issuer[] = [];
  @Output() openIssuer = new EventEmitter<string>();

  sort(event: SortEvent): void {
    const data = event.data as Issuer[];
    if (!data || !event.field || !event.order) {
      return;
    }

    data.sort((left: Issuer, right: Issuer) => {
      const multiplier = event.order ?? 1;
      if (event.field === 'lastUpdated') {
        return (new Date(left.lastUpdated).getTime() - new Date(right.lastUpdated).getTime()) * multiplier;
      }

      if (event.field === 'rating') {
        return (this.ratingWeight(left.rating) - this.ratingWeight(right.rating)) * -1 * multiplier;
      }

      const leftValue = String(left[event.field as keyof Issuer] ?? '').toLowerCase();
      const rightValue = String(right[event.field as keyof Issuer] ?? '').toLowerCase();
      return leftValue.localeCompare(rightValue) * multiplier;
    });
  }

  outlookClass(outlook: Issuer['outlook']): string {
    return {
      Positive: 'outlook-positive',
      Stable: 'outlook-stable',
      Negative: 'outlook-negative',
    }[outlook];
  }

  private ratingWeight(rating: string): number {
    const scale: Record<string, number> = {
      Aaa: 1,
      Aa1: 2,
      Aa2: 3,
      Aa3: 4,
      A1: 5,
      A2: 6,
      A3: 7,
      Baa1: 8,
      Baa2: 9,
      Baa3: 10,
      Ba1: 11,
      Ba2: 12,
      Ba3: 13,
      B1: 14,
      B2: 15,
      B3: 16,
    };

    return scale[rating] ?? 99;
  }
}
