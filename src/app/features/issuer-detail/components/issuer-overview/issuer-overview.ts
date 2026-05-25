import { Component, Input } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { Card } from 'primeng/card';
import { Issuer } from '../../../../core/models/issuer.model';

@Component({
  selector: 'app-issuer-overview',
  imports: [Card, DatePipe, NgClass],
  templateUrl: './issuer-overview.html',
  styleUrl: './issuer-overview.scss',
})
export class IssuerOverview {
  @Input({ required: true }) issuer!: Issuer;

  outlookClass(outlook: Issuer['outlook']): string {
    return {
      Positive: 'outlook-positive',
      Stable: 'outlook-stable',
      Negative: 'outlook-negative',
    }[outlook];
  }

  outlookIconClass(outlook: Issuer['outlook']): string {
    return {
      Positive: 'pi-arrow-up-right',
      Stable: 'pi-check-circle',
      Negative: 'pi-arrow-down-right',
    }[outlook];
  }
}
