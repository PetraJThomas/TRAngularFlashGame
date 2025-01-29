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
    {
      question: 'What is the command to create a new Angular project?',
      answers: ['ng new project-name', 'angular create project-name', 'npm create project-name'],
      correctAnswer: 'ng new project-name',
    },
    {
      question: 'Which directive is used for two-way data binding in Angular?',
      answers: ['ngBind', 'ngModel', 'ngTwoWay'],
      correctAnswer: 'ngModel',
    },
    {
      question: 'What is the purpose of Angular CLI?',
      answers: ['To write backend code', 'To generate Angular components, services, and modules', 'To style Angular components'],
      correctAnswer: 'To generate Angular components, services, and modules',
    },
    {
      question: 'Which file contains the root module definition in an Angular project?',
      answers: ['main.ts', 'app.module.ts', 'index.html'],
      correctAnswer: 'app.module.ts',
    },
    {
      question: 'Which decorator is used to define an Angular component?',
      answers: ['@Component', '@Module', '@Service'],
      correctAnswer: '@Component',
    },
    {
      question: 'What is the main advantage of Angular over jQuery?',
      answers: ['Better DOM manipulation', 'Component-based architecture', 'Faster animations'],
      correctAnswer: 'Component-based architecture',
    },
    {
      question: 'What is dependency injection in Angular?',
      answers: ['A way to handle API calls', 'A way to inject services into components', 'A method for styling Angular applications'],
      correctAnswer: 'A way to inject services into components',
    },
    {
      question: 'Which lifecycle hook is called once after the component is initialized?',
      answers: ['ngOnInit', 'ngAfterViewInit', 'ngOnDestroy'],
      correctAnswer: 'ngOnInit',
    },
    {
      question: 'What is the purpose of Angular Router?',
      answers: ['To fetch data from APIs', 'To handle navigation between views', 'To apply animations'],
      correctAnswer: 'To handle navigation between views',
    },
    {
      question: 'What does the async pipe do in Angular?',
      answers: ['Handles HTTP requests', 'Automatically subscribes to and unsubscribes from observables', 'Creates animations'],
      correctAnswer: 'Automatically subscribes to and unsubscribes from observables',
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
  
    setTimeout(() => this.loadNextCard(), 2000);
  }
  

  loadNextCard() {
    this.showingFeedback = false;
  
    if (this.userResponses.length >= this.flashcards.length) {
      this.showResults = true;
    } else {
      let nextIndex: number;
  
      // ✅ Find the next unique question FIRST
      do {
        nextIndex = Math.floor(Math.random() * this.flashcards.length);
      } while (this.userResponses.some(response => response.question === this.flashcards[nextIndex].question));
  
      console.log("Before update:", { currentIndex: this.currentIndex, nextIndex });
  
      // ✅ Update currentIndex FIRST
      this.currentIndex = nextIndex;
      this.currentCard = { ...this.flashcards[this.currentIndex] };
  
      console.log("After update:", { currentIndex: this.currentIndex, currentCard: this.currentCard });
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