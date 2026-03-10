import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface DeckInfo {
  id: string;
  name: string;
  file: string;
  count: number;
}

export interface Question {
  question: string;
  answers: string[];
  correctAnswer: string;
}

interface DeckFile {
  name: string;
  questions: Question[];
}

@Injectable({ providedIn: 'root' })
export class DeckService {
  private platformId = inject(PLATFORM_ID);

  async loadDeckList(): Promise<DeckInfo[]> {
    if (!isPlatformBrowser(this.platformId)) return [];
    const res = await fetch('/flash-questions/_index.json');
    return res.json();
  }

  async loadDeck(filename: string): Promise<Question[]> {
    if (!isPlatformBrowser(this.platformId)) return [];
    const res = await fetch(`/flash-questions/${filename}`);
    const data: DeckFile = await res.json();
    return data.questions;
  }

  async loadAllDecks(): Promise<Question[]> {
    const deckList = await this.loadDeckList();
    const allQuestions = await Promise.all(
      deckList.map(d => this.loadDeck(d.file))
    );
    return allQuestions.flat();
  }
}
