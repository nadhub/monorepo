// card.component.ts - Reusable Card Component

import { Component, Input, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  @Input() title?: string;
  @Input() variant: 'default' | 'primary' | 'success' | 'warning' = 'default';
  @Input() hoverable = signal(false);

  cardClasses = computed(() => {
    return [
      'card',
      `card--${this.variant}`,
      this.hoverable() ? 'card--hoverable' : ''
    ].filter(Boolean).join(' ');
  });
}
