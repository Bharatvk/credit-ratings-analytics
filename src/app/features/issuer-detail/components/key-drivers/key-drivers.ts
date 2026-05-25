import { Component, Input } from '@angular/core';
import { Card } from 'primeng/card';
import { ProgressBar } from 'primeng/progressbar';
import { Tag } from 'primeng/tag';
import { KeyDriver } from '../../../../core/models/issuer.model';

@Component({
  selector: 'app-key-drivers',
  imports: [Card, Tag, ProgressBar],
  templateUrl: './key-drivers.html',
  styleUrl: './key-drivers.scss',
})
export class KeyDrivers {
  @Input() drivers: KeyDriver[] = [];

  impactSeverity(impact: KeyDriver['impact']): 'success' | 'danger' | 'info' | 'secondary' {
    if (impact === 'Positive') {
      return 'success';
    }
    if (impact === 'Negative') {
      return 'danger';
    }
    return 'secondary';
  }
}
