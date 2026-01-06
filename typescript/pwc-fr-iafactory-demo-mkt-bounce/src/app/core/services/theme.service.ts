import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'theme';
  private _currentTheme = signal<Theme>('light');
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  
  // Public readonly signal
  currentTheme = this._currentTheme.asReadonly();
  
  constructor() {
    // Initialize theme from localStorage or system preference
    this.initTheme();
    
    // Effect to update DOM when theme changes
    effect(() => {
      if (!this.isBrowser) return;
      
      const theme = this._currentTheme();
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(this.THEME_STORAGE_KEY, theme);
    });
  }
  
  /**
   * Initialize theme from localStorage or system preference
   */
  initTheme(): void {
    if (!this.isBrowser) return;
    
    const savedTheme = localStorage.getItem(this.THEME_STORAGE_KEY) as Theme | null;
    
    if (savedTheme) {
      this._currentTheme.set(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this._currentTheme.set(prefersDark ? 'dark' : 'light');
    }
  }
  
  /**
   * Toggle between light and dark theme
   */
  toggleTheme(): void {
    const newTheme = this._currentTheme() === 'light' ? 'dark' : 'light';
    this._currentTheme.set(newTheme);
  }
  
  /**
   * Set specific theme
   */
  setTheme(theme: Theme): void {
    this._currentTheme.set(theme);
  }
  
  /**
   * Check if current theme is dark
   */
  isDarkMode(): boolean {
    return this._currentTheme() === 'dark';
  }
}
