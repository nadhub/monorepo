// input.component.ts
import { Component, Input, Output, EventEmitter, signal, computed, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputComponent),
    multi: true
  }]
})
export class InputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() disabled = signal(false);
  @Input() error = signal<string | null>(null);
  @Input() helpText?: string;
  @Input() required = false;

  value = signal('');
  inputId = `input-${Math.random().toString(36).substr(2, 9)}`;

  inputClasses = computed(() => {
    return [
      'form-input',
      this.error() ? 'form-input--error' : ''
    ].filter(Boolean).join(' ');
  });

  private onChange: any = () => {};
  private onTouched: any = () => {};

  writeValue(value: any): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);
    this.onChange(value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
