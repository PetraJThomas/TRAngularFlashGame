import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { FlashcardComponent } from '../flashcard/flashcard.component';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DeckService, Question } from '../deck.service';

@Component({
  selector: 'app-game-screen',
  standalone: true,
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.scss'],
  imports: [FlashcardComponent, CommonModule, MatButton, MatIconModule],
  animations: [
    trigger('fadeScale', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' })),
      ]),
    ]),
  ],
})
export class GameScreenComponent implements OnInit, OnDestroy {
  private deckService = inject(DeckService);
  private router = inject(Router);

  @Input() deck = '';

  flashcards: Question[] = [];
  loading = true;
  currentCard: any = null;
  currentIndex = 0;
  showResults = false;
  showingFeedback = false;
  feedbackMessage = '';
  isCorrectFeedback = false;
  leavingResults = false;
  private pendingAction: (() => void) | null = null;
  score = 0;
  userResponses: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[] = [];
  private nextCardTimeoutId: ReturnType<typeof setTimeout> | null = null;

  async ngOnInit() {
    if (this.deck === 'all' || !this.deck) {
      this.flashcards = await this.deckService.loadAllDecks();
    } else {
      this.flashcards = await this.deckService.loadDeck(this.deck);
    }
    this.flashcards = this.shuffleArray([...this.flashcards]);
    this.currentCard = this.flashcards[this.currentIndex];
    this.loading = false;
  }

  ngOnDestroy() {
    if (this.nextCardTimeoutId) {
      clearTimeout(this.nextCardTimeoutId);
    }
  }

  handleAnswer({ isCorrect, userAnswer }: { isCorrect: boolean; userAnswer: string }) {
    this.feedbackMessage = isCorrect ? 'You Got It!' : 'Better Luck Next Time.';
    this.isCorrectFeedback = isCorrect;

    this.userResponses.push({
      question: this.currentCard.question,
      userAnswer,
      correctAnswer: this.currentCard.correctAnswer,
      isCorrect
    });

    if (isCorrect) {
      this.score++;
    }

    this.showingFeedback = true;

    this.nextCardTimeoutId = setTimeout(() => this.loadNextCard(), 2000);
  }


  loadNextCard() {
    this.showingFeedback = false;

    if (this.currentIndex >= this.flashcards.length - 1) {
      this.showResults = true;
    } else {
      this.currentIndex++;
      this.currentCard = { ...this.flashcards[this.currentIndex] };
    }
  }


  dismissResults(action: () => void) {
    this.pendingAction = action;
    this.leavingResults = true;
  }

  onResultsLeave() {
    if (this.pendingAction) {
      this.pendingAction();
      this.pendingAction = null;
    }
  }

  async replay() {
    this.dismissResults(async () => {
      this.currentIndex = 0;
      this.showResults = false;
      this.leavingResults = false;
      this.showingFeedback = false;
      this.feedbackMessage = '';
      this.score = 0;
      this.userResponses = [];
      this.loading = true;

      if (this.deck === 'all' || !this.deck) {
        this.flashcards = await this.deckService.loadAllDecks();
      } else {
        this.flashcards = await this.deckService.loadDeck(this.deck);
      }
      this.flashcards = this.shuffleArray([...this.flashcards]);
      this.currentCard = this.flashcards[this.currentIndex];
      this.loading = false;
    });
  }

  startNewGame() {
    this.dismissResults(() => {
      setTimeout(() => this.router.navigate(['/']), 300);
    });
  }

  shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
