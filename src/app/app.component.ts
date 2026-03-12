import { Component, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ThemeToggleComponent } from './theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterModule, ThemeToggleComponent],
  animations: [
    trigger('pageFade', [
      state('in', style({ opacity: 1 })),
      state('out', style({ opacity: 0 })),
      transition('void => in', [
        style({ opacity: 0 }),
        animate('2000ms ease-out'),
      ]),
      transition('in => out', [
        animate('400ms ease-in'),
      ]),
    ]),
  ],
})
export class AppComponent {
  title = 'TRAngularFlashGame';
  fadeState = signal<'in' | 'out'>('in');

  private platformId = inject(PLATFORM_ID);

  navigateToPortfolio() {
    this.fadeState.set('out');
  }

  onFadeDone(event: any) {
    if (event.toState === 'out' && isPlatformBrowser(this.platformId)) {
      window.location.href = 'https://portfolio.petrajthomas.com/appsgallery';
    }
  }
}
