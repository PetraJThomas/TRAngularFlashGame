import { Routes } from '@angular/router';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { GameScreenComponent } from './game-screen/game-screen.component';
import { FlashcardComponent } from './flashcard/flashcard.component';

export const routes: Routes = [
  { path: '', component: StartScreenComponent },
  { path: 'game', component: GameScreenComponent },
  { path: 'flashcard', component: FlashcardComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Redirect unknown routes to home
];