import { Component } from '@angular/core';
import { FlashcardComponent } from '../flashcard/flashcard.component';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-game-screen',
  standalone: true,
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.scss'],
  imports: [FlashcardComponent, CommonModule, MatButton],
})
export class GameScreenComponent {
  flashcards = [
    {
      question: 'What is Angular?',
      answers: ['A car', 'A framework', 'A library'],
      correctAnswer: 'A framework',
    },
    {
      question: 'What language does Angular use?',
      answers: ['Java', 'Python', 'TypeScript'],
      correctAnswer: 'TypeScript',
    },
    {
      question: 'Who created Angular?',
      answers: ['Microsoft', 'Facebook', 'Google'],
      correctAnswer: 'Google',
    },
  ];

  currentCard: any = null; // ✅ Track the current card dynamically
  currentIndex = 0;
  showResults = false;
  showingFeedback = false;
  feedbackMessage = '';
  score = 0;
  userResponses: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[] = [];

  ngOnInit() {
    this.currentCard = this.flashcards[this.currentIndex]; // ✅ Set the first card on load
  }

  handleAnswer({ isCorrect, userAnswer }: { isCorrect: boolean; userAnswer: string }) {
    this.feedbackMessage = isCorrect ? '🎉 You Got It!' : '💪 Better Luck Next Time.';
  
    // ✅ Store unique responses
    if (!this.userResponses.some(response => response.question === this.currentCard.question)) {
      this.userResponses.push({
        question: this.currentCard.question,
        userAnswer,
        correctAnswer: this.currentCard.correctAnswer,
        isCorrect
      });
    }
  
    if (isCorrect) {
      this.score++;
    }
  
    this.showingFeedback = true;
  
    setTimeout(() => this.loadNextCard(), 3200);
  }
  

  loadNextCard() {
    this.showingFeedback = false;
  
    if (this.userResponses.length >= this.flashcards.length) {
      this.showResults = true;
    } else {
      // ✅ Move to the next unique question
      let nextIndex = 0;
      do {
        nextIndex = Math.floor(Math.random() * this.flashcards.length);
      } while (this.userResponses.some(response => response.question === this.flashcards[nextIndex].question));
  
      this.currentIndex = nextIndex;
      this.currentCard = this.flashcards[this.currentIndex];
    }
  }
  

  startNewGame() {
    this.currentIndex = 0;
    this.showResults = false;
    this.showingFeedback = false;
    this.feedbackMessage = '';
    this.score = 0;
    this.userResponses = [];

    // Shuffle cards for a new game
    this.flashcards = this.shuffleArray([...this.flashcards]);
    this.currentCard = this.flashcards[this.currentIndex]; // ✅ Reset to the first card
  }

  shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}