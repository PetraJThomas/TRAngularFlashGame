import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FlashcardService {
  private score = 0;

  updateScore(isCorrect: boolean) {
    if (isCorrect) {
      this.score++;
    }
  }

  getScore(): number {
    return this.score;
  }
}
