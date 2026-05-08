import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ConvexClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';
import { environment } from '../environments/environment';

export interface DeckInfo {
  slug: string;
  name: string;
  count: number;
}

export interface Question {
  question: string;
  answers: string[];
  correctAnswer: string;
}

export interface ImportedDeck {
  name: string;
  questions: Question[];
}

export type ValidationResult =
  | { ok: true; deck: ImportedDeck }
  | { ok: false; error: string };

@Injectable({ providedIn: 'root' })
export class DeckService {
  private platformId = inject(PLATFORM_ID);
  private client: ConvexClient | null = null;
  private importedDeck: ImportedDeck | null = null;

  private getClient(): ConvexClient | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    if (!environment.convexUrl) {
      console.warn('Convex URL is not configured. Set environment.convexUrl.');
      return null;
    }
    if (!this.client) {
      this.client = new ConvexClient(environment.convexUrl.replace(/\/$/, ''));
    }
    return this.client;
  }

  async loadDeckList(): Promise<DeckInfo[]> {
    const client = this.getClient();
    if (!client) return [];
    return client.query(api.decks.listDecks, {});
  }

  async loadDeck(slug: string): Promise<Question[]> {
    const client = this.getClient();
    if (!client) return [];
    return client.query(api.decks.getDeckQuestions, { slug });
  }

  async loadAllDecks(): Promise<Question[]> {
    const client = this.getClient();
    if (!client) return [];
    return client.query(api.decks.getAllQuestions, {});
  }

  setImportedDeck(deck: ImportedDeck): void {
    this.importedDeck = deck;
  }

  getImportedDeck(): ImportedDeck | null {
    return this.importedDeck;
  }

  validateDeck(raw: unknown): ValidationResult {
    if (raw === null || typeof raw !== 'object') {
      return { ok: false, error: 'File must contain a JSON object or array.' };
    }

    let name = 'Imported Deck';
    let questions: unknown;

    if (Array.isArray(raw)) {
      questions = raw;
    } else {
      const obj = raw as Record<string, unknown>;
      if (typeof obj['name'] === 'string' && obj['name'].trim()) {
        name = obj['name'].trim();
      }
      questions = obj['questions'];
      if (questions === undefined) {
        return { ok: false, error: 'Missing "questions" array on root object.' };
      }
    }

    if (!Array.isArray(questions)) {
      return { ok: false, error: '"questions" must be an array.' };
    }
    if (questions.length === 0) {
      return { ok: false, error: 'Deck has no questions.' };
    }

    const validated: Question[] = [];
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i] as Record<string, unknown>;
      const label = `Question ${i + 1}`;

      if (!q || typeof q !== 'object' || Array.isArray(q)) {
        return { ok: false, error: `${label}: must be an object.` };
      }
      if (typeof q['question'] !== 'string' || !q['question'].trim()) {
        return { ok: false, error: `${label}: "question" must be a non-empty string.` };
      }
      if (!Array.isArray(q['answers'])) {
        return { ok: false, error: `${label}: "answers" must be an array.` };
      }
      const answers = q['answers'] as unknown[];
      if (answers.length < 2) {
        return { ok: false, error: `${label}: needs at least 2 answers.` };
      }
      if (!answers.every((a) => typeof a === 'string' && a.trim())) {
        return { ok: false, error: `${label}: every answer must be a non-empty string.` };
      }
      if (typeof q['correctAnswer'] !== 'string' || !q['correctAnswer'].trim()) {
        return { ok: false, error: `${label}: "correctAnswer" must be a non-empty string.` };
      }
      if (!answers.includes(q['correctAnswer'])) {
        return { ok: false, error: `${label}: "correctAnswer" must match one of the answers.` };
      }

      validated.push({
        question: q['question'] as string,
        answers: answers as string[],
        correctAnswer: q['correctAnswer'] as string,
      });
    }

    return { ok: true, deck: { name, questions: validated } };
  }
}
