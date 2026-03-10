import { Component, OnDestroy } from '@angular/core';
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
export class GameScreenComponent implements OnDestroy {
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
      question: 'Which file bootstraps a standalone Angular application?',
      answers: ['main.ts', 'app.config.ts', 'index.html'],
      correctAnswer: 'app.config.ts',
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
    {
      question: 'What lifecycle hook runs when Angular detects changes to @Input properties?',
      answers: ['ngOnInit', 'ngOnChanges', 'ngAfterViewInit'],
      correctAnswer: 'ngOnChanges',
    },
    {
      question: 'Which Angular lifecycle hook is used to clean up subscriptions or resources?',
      answers: ['ngOnDestroy', 'ngAfterViewChecked', 'ngAfterContentInit'],
      correctAnswer: 'ngOnDestroy',
    },
    {
      question: 'Which lifecycle hook runs after Angular initializes the component view and child views?',
      answers: ['ngAfterViewInit', 'ngOnInit', 'ngOnChanges'],
      correctAnswer: 'ngAfterViewInit',
    },
    {
      question: 'What is the purpose of Angular services?',
      answers: [
        'To store HTML templates',
        'To share business logic and data across components',
        'To replace Angular modules',
      ],
      correctAnswer: 'To share business logic and data across components',
    },
    {
      question: 'What Angular feature allows components to receive dependencies automatically?',
      answers: ['Dependency Injection', 'Data Binding', 'NgModules'],
      correctAnswer: 'Dependency Injection',
    },
    {
      question: 'Which RxJS concept represents a stream of asynchronous data?',
      answers: ['Observable', 'Promise', 'StreamPipe'],
      correctAnswer: 'Observable',
    },
    {
      question: 'Which Angular pipe is commonly used to consume Observables in templates?',
      answers: ['observablePipe', 'async', 'subscribePipe'],
      correctAnswer: 'async',
    },
    {
      question: 'What Angular feature allows communication from parent to child components?',
      answers: ['@Input', '@Inject', '@HostListener'],
      correctAnswer: '@Input',
    },
    {
      question: 'What decorator allows a child component to emit events to its parent?',
      answers: ['@Input', '@Output', '@Directive'],
      correctAnswer: '@Output',
    },
    {
      question: 'Which Angular feature protects routes from unauthorized access?',
      answers: ['Route Guards', 'NgModules', 'Angular Pipes'],
      correctAnswer: 'Route Guards',
    },
    {
      question: 'Which HTTP status code indicates an unauthorized request?',
      answers: ['401', '200', '500'],
      correctAnswer: '401',
    },
    {
      question: 'Which HTTP status code indicates access is forbidden even if authenticated?',
      answers: ['403', '404', '302'],
      correctAnswer: '403',
    },
    {
      question: 'What is the difference between authentication and authorization?',
      answers: [
        'Authentication verifies identity, authorization determines permissions',
        'Authorization verifies identity, authentication determines permissions',
        'They are the same thing',
      ],
      correctAnswer: 'Authentication verifies identity, authorization determines permissions',
    },
    {
      question: 'What token format is commonly used for stateless API authentication?',
      answers: ['JWT', 'XML', 'OAuthKey'],
      correctAnswer: 'JWT',
    },
    {
      question: 'Where should authorization checks be enforced?',
      answers: [
        'Only in the frontend',
        'In the backend API',
        'In the browser storage',
      ],
      correctAnswer: 'In the backend API',
    },
    {
      question: 'In Angular, how are HTTP requests typically made?',
      answers: ['HttpClient', 'FetchService', 'AngularRequest'],
      correctAnswer: 'HttpClient',
    },
    {
      question: 'Which .NET feature maps incoming HTTP requests to methods?',
      answers: ['Controllers', 'Repositories', 'ViewModels'],
      correctAnswer: 'Controllers',
    },
    {
      question: 'Which .NET attribute defines an API route?',
      answers: ['[Route]', '[HttpGet]', '[Endpoint]'],
      correctAnswer: '[Route]',
    },
    {
      question: 'Which .NET attribute is commonly used to require authentication on an endpoint?',
      answers: ['[Authorize]', '[Secure]', '[ValidateUser]'],
      correctAnswer: '[Authorize]',
    },
    {
      question: 'What is the purpose of middleware in ASP.NET?',
      answers: [
        'To intercept and process HTTP requests and responses',
        'To store database data',
        'To generate HTML templates',
      ],
      correctAnswer: 'To intercept and process HTTP requests and responses',
    },
    {
      question: 'Why should APIs return DTOs instead of database entities?',
      answers: [
        'To reduce database load',
        'To control what data is exposed and decouple internal models',
        'To increase server memory',
      ],
      correctAnswer: 'To control what data is exposed and decouple internal models',
    },
    {
      question: 'In a secure Angular + .NET system, what typically happens after login?',
      answers: [
        'Frontend stores a token and sends it with API requests',
        'Frontend stores the user password',
        'Frontend directly accesses the database',
      ],
      correctAnswer: 'Frontend stores a token and sends it with API requests',
    },
    {
      question: 'What Angular mechanism detects and updates the UI when data changes?',
      answers: ['Change Detection', 'Zone Trigger', 'State Hook'],
      correctAnswer: 'Change Detection',
    },
    {
      question: 'What library powers Angular\'s reactive programming model?',
      answers: ['RxJS', 'Redux', 'SignalJS'],
      correctAnswer: 'RxJS',
    },
    {
      question: 'Which RxJS operator is commonly used to transform emitted values?',
      answers: ['map', 'filter', 'emit'],
      correctAnswer: 'map',
    },
    {
      question: 'Which RxJS operator cancels previous requests when a new value arrives?',
      answers: ['switchMap', 'concatMap', 'mergeMap'],
      correctAnswer: 'switchMap',
    },
    {
      question: 'Which RxJS operator is used to perform side effects without modifying the stream?',
      answers: ['tap', 'map', 'switchMap'],
      correctAnswer: 'tap',
    },
    {
      question: 'What Angular feature improves performance by reducing unnecessary change detection?',
      answers: ['OnPush Change Detection', 'Async Modules', 'Reactive Zones'],
      correctAnswer: 'OnPush Change Detection',
    },
    {
      question: 'What is Angular Zone.js responsible for?',
      answers: [
        'Tracking async operations to trigger change detection',
        'Managing CSS animations',
        'Handling HTTP routing',
      ],
      correctAnswer: 'Tracking async operations to trigger change detection',
    },
    {
      question: 'Which Angular feature allows lazy loading of modules?',
      answers: ['Lazy Modules', 'Router Lazy Loading', 'Deferred Components'],
      correctAnswer: 'Router Lazy Loading',
    },
    {
      question: 'What is the main purpose of CORS in web APIs?',
      answers: [
        'Allow controlled cross-origin requests between frontend and API',
        'Improve API caching',
        'Encrypt API responses',
      ],
      correctAnswer: 'Allow controlled cross-origin requests between frontend and API',
    },
    {
      question: 'What does OAuth primarily provide?',
      answers: [
        'Authorization delegation',
        'Encryption of database queries',
        'Frontend routing',
      ],
      correctAnswer: 'Authorization delegation',
    },
    {
      question: 'What does OpenID Connect add on top of OAuth?',
      answers: [
        'Authentication and identity information',
        'Database replication',
        'Frontend state management',
      ],
      correctAnswer: 'Authentication and identity information',
    },
    {
      question: 'What claim in a JWT typically identifies the user?',
      answers: ['sub', 'exp', 'aud'],
      correctAnswer: 'sub',
    },
    {
      question: 'What claim in a JWT defines expiration time?',
      answers: ['exp', 'iat', 'sub'],
      correctAnswer: 'exp',
    },
    {
      question: 'Why should tokens usually be short-lived?',
      answers: [
        'Reduce risk if a token is compromised',
        'Increase frontend speed',
        'Reduce database load',
      ],
      correctAnswer: 'Reduce risk if a token is compromised',
    },
    {
      question: 'What is a refresh token used for?',
      answers: [
        'Obtaining a new access token without re-authenticating',
        'Refreshing browser sessions',
        'Encrypting API responses',
      ],
      correctAnswer: 'Obtaining a new access token without re-authenticating',
    },
    {
      question: 'What .NET feature allows services to be injected into controllers?',
      answers: ['Dependency Injection', 'Service Loader', 'Controller Binding'],
      correctAnswer: 'Dependency Injection',
    },
    {
      question: 'Which ASP.NET pipeline component handles authentication before controllers run?',
      answers: ['Middleware', 'Repository', 'View Engine'],
      correctAnswer: 'Middleware',
    },
    {
      question: 'Why should APIs avoid returning database entities directly?',
      answers: [
        'To control exposed fields and prevent tight coupling',
        'To reduce API speed',
        'To simplify SQL queries',
      ],
      correctAnswer: 'To control exposed fields and prevent tight coupling',
    },
    {
      question: 'What pattern is commonly used in .NET APIs to separate logic from controllers?',
      answers: ['Service Layer', 'Template Pattern', 'Observer Pattern'],
      correctAnswer: 'Service Layer',
    },
    {
      question: 'What security principle states that users should only have access to what they need?',
      answers: [
        'Principle of Least Privilege',
        'Maximum Access Model',
        'Open Authorization',
      ],
      correctAnswer: 'Principle of Least Privilege',
    },
    {
      question: 'What technique prevents excessive API requests from clients?',
      answers: ['Rate Limiting', 'Token Hashing', 'Lazy Loading'],
      correctAnswer: 'Rate Limiting',
    },
  ];


  currentCard: any = null;
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
  private nextCardTimeoutId: ReturnType<typeof setTimeout> | null = null;

  ngOnInit() {
    this.flashcards = this.shuffleArray([...this.flashcards]);
    this.currentCard = this.flashcards[this.currentIndex];
  }

  ngOnDestroy() {
    if (this.nextCardTimeoutId) {
      clearTimeout(this.nextCardTimeoutId);
    }
  }

  handleAnswer({ isCorrect, userAnswer }: { isCorrect: boolean; userAnswer: string }) {
    this.feedbackMessage = isCorrect ? '🎉 You Got It!' : '💪 Better Luck Next Time.';

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


  startNewGame() {
    this.currentIndex = 0;
    this.showResults = false;
    this.showingFeedback = false;
    this.feedbackMessage = '';
    this.score = 0;
    this.userResponses = [];

    this.flashcards = this.shuffleArray([...this.flashcards]);
    this.currentCard = this.flashcards[this.currentIndex];
  }

  shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
