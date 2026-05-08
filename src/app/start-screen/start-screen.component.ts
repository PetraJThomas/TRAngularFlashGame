import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeckInfo, DeckService } from '../deck.service';

@Component({
  selector: 'app-start-screen',
  imports: [CommonModule, MatButtonModule, MatDividerModule, MatIconModule, MatCardModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss',
  animations: [
    trigger('fadeScaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class StartScreenComponent implements OnInit {
  private deckService = inject(DeckService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private snackBar = inject(MatSnackBar);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  decks: DeckInfo[] = [];
  totalCount = 0;

  async ngOnInit() {
    this.decks = await this.deckService.loadDeckList();
    this.totalCount = this.decks.reduce((sum, d) => sum + d.count, 0);
    this.cdr.markForCheck();
  }

  selectDeck(slug: string) {
    this.router.navigate(['/game'], { queryParams: { deck: slug } });
  }

  selectAll() {
    this.router.navigate(['/game'], { queryParams: { deck: 'all' } });
  }

  triggerImport() {
    this.fileInput.nativeElement.click();
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    let text: string;
    try {
      text = await file.text();
    } catch {
      this.showError('Could not read the selected file.');
      return;
    }

    let raw: unknown;
    try {
      raw = JSON.parse(text);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Invalid JSON.';
      this.showError(`Invalid JSON: ${msg}`);
      return;
    }

    const result = this.deckService.validateDeck(raw);
    if (!result.ok) {
      this.showError(result.error);
      return;
    }

    this.deckService.setImportedDeck(result.deck);
    this.router.navigate(['/game'], { queryParams: { deck: 'imported' } });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Dismiss', {
      duration: 6000,
      panelClass: ['import-error-snackbar'],
    });
  }
}
