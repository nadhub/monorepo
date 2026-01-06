import { Pipe, PipeTransform, inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TranslationService } from '../../core/services/translation.service';
import { effect, Injector, runInInjectionContext } from '@angular/core';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private translationService = inject(TranslationService);
  private cdr = inject(ChangeDetectorRef);
  private injector = inject(Injector);
  private effectRef: any;

  constructor() {
    // Create an effect that triggers when language changes
    runInInjectionContext(this.injector, () => {
      this.effectRef = effect(() => {
        // Read the signal to track changes
        this.translationService.currentLanguage();
        // Mark for check when language changes
        this.cdr.markForCheck();
      });
    });
  }

  transform(key: string): string {
    return this.translationService.translate(key);
  }

  ngOnDestroy(): void {
    if (this.effectRef) {
      this.effectRef.destroy();
    }
  }
}