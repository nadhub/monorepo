import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingComponent {
  @Input() type: 'spinner' | 'skeleton' | 'overlay' = 'spinner';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() message?: string;
}
