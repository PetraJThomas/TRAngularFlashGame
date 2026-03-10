import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flashcard',
  standalone: true,
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.scss'],
  imports: [MatCardModule, MatButtonModule, MatIconModule, CommonModule],
  animations: [
    trigger('flyThrough', [
      state('default', style({ opacity: 0, transform: 'scale(0.8)' })), // First card starts small
      state('visible', style({ opacity: 1, transform: 'scale(1)' })), // Fully visible
      state('zoomOut', style({ opacity: 0, transform: 'scale(1.5) translateZ(300px)' })), // Fly through

      transition('default => visible', animate('600ms ease-out')), // First card fades in
      transition('visible => zoomOut', animate('700ms ease-in', keyframes([
        style({ opacity: 1, transform: 'scale(1.1)', offset: 0.3 }), // Slight zoom before disappearing
        style({ opacity: 0.5, transform: 'scale(1.3)', offset: 0.6 }), // More zoom, fading
        style({ opacity: 0, transform: 'scale(1.5)', offset: 1 }) // Fully disappears
      ]))),
      transition('zoomOut => visible', animate('700ms ease-out', keyframes([
        style({ opacity: 0, transform: 'scale(0.5)', offset: 0 }), // Starts small
        style({ opacity: 0.5, transform: 'scale(0.8)', offset: 0.3 }), // Grows in
        style({ opacity: 1, transform: 'scale(1)', offset: 1 }) // Fully visible
      ])))
    ])
  ]
})
export class FlashcardComponent implements OnDestroy {
  @Input() question: string = '';
  @Input() answers: string[] = [];
  @Input() correctAnswer: string = '';
  @Input() isFeedback: boolean = false;
  @Input() feedbackMessage: string = '';
  @Input() isCorrectFeedback: boolean = false;
  @Output() transitionComplete = new EventEmitter<{ isCorrect: boolean; userAnswer: string }>();

  shuffledAnswers: string[] = [];
  animationState: 'default' | 'visible' | 'zoomOut' = 'default';
  private answered = false;
  private timeoutIds: ReturnType<typeof setTimeout>[] = [];

  ngOnInit() {
    this.shuffledAnswers = this.shuffleArray([...this.answers]);
    this.timeoutIds.push(
      setTimeout(() => {
        this.animationState = 'visible';
      }, 500)
    );

    if (this.isFeedback) {
      this.timeoutIds.push(
        setTimeout(() => {
          this.animationState = 'zoomOut';
        }, 1000)
      );
    }
  }

  ngOnDestroy() {
    this.timeoutIds.forEach(id => clearTimeout(id));
  }

  private shuffleArray(arr: string[]): string[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  selectAnswer(answer: string) {
    if (this.answered) return;
    this.answered = true;

    const isCorrect = answer === this.correctAnswer;
    this.animationState = 'zoomOut';

    this.timeoutIds.push(
      setTimeout(() => {
        this.transitionComplete.emit({ isCorrect, userAnswer: answer });
      }, 700)
    );
  }
}
