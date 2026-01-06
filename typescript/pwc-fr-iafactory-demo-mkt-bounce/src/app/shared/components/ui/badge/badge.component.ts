import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'departure' | 'contact' | 'autoreply' | 'employee-departure' | 'delete' | 'add' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClasses()">
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class BadgeComponent {
  @Input() set variant(value: BadgeVariant) {
    this._variant.set(value);
  }
  
  private _variant = signal<BadgeVariant>('primary');
  
  badgeClasses = computed(() => `badge badge-${this._variant()}`);
}
