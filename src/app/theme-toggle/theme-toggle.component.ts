import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatSlideToggleModule],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
})
export class ThemeToggleComponent {
  panelOpen = signal(false);

  constructor(public theme: ThemeService) {}

  togglePanel(event: Event): void {
    event.stopPropagation();
    this.panelOpen.update(v => !v);
  }

  onHueChange(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    this.theme.setHue(value);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.panelOpen.set(false);
  }
}
