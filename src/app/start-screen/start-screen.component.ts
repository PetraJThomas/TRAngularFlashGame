import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { DeckInfo, DeckService } from '../deck.service';

@Component({
  selector: 'app-start-screen',
  imports: [CommonModule, MatButtonModule, MatDividerModule, MatIconModule, MatCardModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent implements OnInit {
  private deckService = inject(DeckService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  decks: DeckInfo[] = [];
  totalCount = 0;

  async ngOnInit() {
    this.decks = await this.deckService.loadDeckList();
    this.totalCount = this.decks.reduce((sum, d) => sum + d.count, 0);
    this.cdr.markForCheck();
  }

  selectDeck(filename: string) {
    this.router.navigate(['/game'], { queryParams: { deck: filename } });
  }

  selectAll() {
    this.router.navigate(['/game'], { queryParams: { deck: 'all' } });
  }
}
