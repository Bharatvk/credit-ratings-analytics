import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  imports: [],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
})
export class EmptyState {
  @Input() title = 'No records available';
  @Input() message = 'Try adjusting filters or check again later.';
  @Input() actionLabel = '';
}
