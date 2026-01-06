import { Directive, ElementRef, Input, OnInit, inject, effect } from '@angular/core';
import { TranslationService } from '../../core/services/translation.service';

@Directive({
  selector: '[appTranslate]',
  standalone: true
})
export class TranslateDirective implements OnInit {
  @Input('appTranslate') key: string = '';
  
  private translationService = inject(TranslationService);
  private el = inject(ElementRef);
  
  constructor() {
    // Effect to update translation when language changes
    effect(() => {
      // Access the signal to create dependency
      this.translationService.currentLanguage();
      this.updateTranslation();
    });
  }
  
  ngOnInit(): void {
    this.updateTranslation();
  }
  
  private updateTranslation(): void {
    if (this.key) {
      const translation = this.translationService.translate(this.key);
      this.el.nativeElement.textContent = translation;
    }
  }
}