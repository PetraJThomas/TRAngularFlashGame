import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flashcard',
  standalone: true,
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.scss'],
  imports: [MatCardModule, MatButtonModule, CommonModule],
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
export class FlashcardComponent {
  @Input() question: string = '';
  @Input() answers: string[] = [];
  @Input() correctAnswer: string = '';
  @Input() isFeedback: boolean = false;
  @Input() feedbackMessage: string = '';
  @Output() transitionComplete = new EventEmitter<{ isCorrect: boolean; userAnswer: string }>();

  animationState: 'default' | 'visible' | 'zoomOut' = 'default';

  ngOnInit() {
    setTimeout(() => {
      this.animationState = 'visible'; // First card fades in
    }, 500);

    if (this.isFeedback) {
      // Auto-transition feedback card after 1.5 seconds
      setTimeout(() => {
        this.animationState = 'zoomOut'; // Trigger fly-through effect
        setTimeout(() => this.transitionComplete.emit(), 700); // Emit event after animation
      }, 1500);
    }
  }

  selectAnswer(answer: string) {
    const isCorrect = answer === this.correctAnswer;
    this.animationState = 'zoomOut'; // Zoom out effect

    setTimeout(() => {
      this.transitionComplete.emit({ isCorrect, userAnswer: answer }); // ✅ Emit correct object
    }, 700);
  }
}