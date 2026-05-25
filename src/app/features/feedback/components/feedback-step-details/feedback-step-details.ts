import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MultiSelect } from 'primeng/multiselect';
import { Textarea } from 'primeng/textarea';
import { Message } from 'primeng/message';
import { Card } from 'primeng/card';
import { KeyDriver } from '../../../../core/models/issuer.model';

interface DriverOption {
  label: string;
  value: string;
  disabled: boolean;
}

@Component({
  selector: 'app-feedback-step-details',
  imports: [ReactiveFormsModule, MultiSelect, Textarea, Message, Card],
  templateUrl: './feedback-step-details.html',
  styleUrl: './feedback-step-details.scss',
})
export class FeedbackStepDetails {
  readonly additionalFactorsMax = 500;
  readonly commentsMax = 1000;

  @Input({ required: true }) group!: FormGroup;
  @Input() drivers: KeyDriver[] = [];

  get agreedDriverOptions(): DriverOption[] {
    const disabledIds = new Set(this.selectedDrivers('disagreedDrivers'));
    return this.drivers.map((driver) => ({
      label: driver.title,
      value: driver.id,
      disabled: disabledIds.has(driver.id),
    }));
  }

  get disagreedDriverOptions(): DriverOption[] {
    const disabledIds = new Set(this.selectedDrivers('agreedDrivers'));
    return this.drivers.map((driver) => ({
      label: driver.title,
      value: driver.id,
      disabled: disabledIds.has(driver.id),
    }));
  }

  onDriverSelectionChange(changedControl: 'agreedDrivers' | 'disagreedDrivers'): void {
    const oppositeControl = changedControl === 'agreedDrivers' ? 'disagreedDrivers' : 'agreedDrivers';
    const changedValues = new Set(this.selectedDrivers(changedControl));
    const opposite = this.group.get(oppositeControl);
    if (!opposite) {
      return;
    }

    const filteredOpposite = this.selectedDrivers(oppositeControl).filter((driverId) => !changedValues.has(driverId));
    if (filteredOpposite.length !== this.selectedDrivers(oppositeControl).length) {
      opposite.setValue(filteredOpposite);
      opposite.markAsDirty();
    }
  }

  private selectedDrivers(controlName: 'agreedDrivers' | 'disagreedDrivers'): string[] {
    const value = this.group.get(controlName)?.value as string[] | null;
    return Array.isArray(value) ? value : [];
  }

  currentLength(controlName: 'additionalFactors' | 'comments'): number {
    const value = this.group.get(controlName)?.value;
    return String(value ?? '').length;
  }

  remainingChars(controlName: 'additionalFactors' | 'comments'): number {
    if (controlName === 'additionalFactors') {
      return this.additionalFactorsMax - this.currentLength(controlName);
    }
    return this.commentsMax - this.currentLength(controlName);
  }

  isNearLimit(controlName: 'additionalFactors' | 'comments'): boolean {
    const remaining = this.remainingChars(controlName);
    return remaining <= 80;
  }
}
