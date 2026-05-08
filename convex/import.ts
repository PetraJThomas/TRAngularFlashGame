import { internalMutation } from './_generated/server';
import { v } from 'convex/values';

const questionValidator = v.object({
  question: v.string(),
  answers: v.array(v.string()),
  correctAnswer: v.string(),
});

/**
 * Insert or replace a deck and all its questions, then refresh the index entry
 * for this deck. Intended as the single ingestion entry point — other apps can
 * call this with raw JSON to publish a new quiz set.
 */
export const importDeck = internalMutation({
  args: {
    slug: v.string(),
    name: v.string(),
    questions: v.array(questionValidator),
  },
  handler: async (ctx, { slug, name, questions }) => {
    if (!slug.trim()) throw new Error('slug must be a non-empty string');
    if (!name.trim()) throw new Error('name must be a non-empty string');
    if (questions.length === 0) throw new Error('Deck has no questions');

    questions.forEach((q, i) => {
      const label = `Question ${i + 1}`;
      if (!q.question.trim()) throw new Error(`${label}: question is empty`);
      if (q.answers.length < 2) throw new Error(`${label}: needs at least 2 answers`);
      if (!q.answers.every((a) => a.trim())) throw new Error(`${label}: answers must be non-empty`);
      if (!q.answers.includes(q.correctAnswer)) {
        throw new Error(`${label}: correctAnswer must match one of the answers`);
      }
    });

    const existingDeck = await ctx.db
      .query('decks')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .unique();
    if (existingDeck) {
      await ctx.db.patch(existingDeck._id, { name });
    } else {
      await ctx.db.insert('decks', { slug, name });
    }

    const oldQuestions = await ctx.db
      .query('questions')
      .withIndex('by_deck', (q) => q.eq('deckSlug', slug))
      .collect();
    for (const q of oldQuestions) {
      await ctx.db.delete(q._id);
    }

    for (const q of questions) {
      await ctx.db.insert('questions', { deckSlug: slug, ...q });
    }

    const existingIndex = await ctx.db
      .query('decksIndex')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .unique();
    if (existingIndex) {
      await ctx.db.patch(existingIndex._id, { name, count: questions.length });
    } else {
      await ctx.db.insert('decksIndex', { slug, name, count: questions.length });
    }

    return { slug, count: questions.length };
  },
});

export const deleteDeck = internalMutation({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const deck = await ctx.db
      .query('decks')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .unique();
    if (deck) await ctx.db.delete(deck._id);

    const questions = await ctx.db
      .query('questions')
      .withIndex('by_deck', (q) => q.eq('deckSlug', slug))
      .collect();
    for (const q of questions) await ctx.db.delete(q._id);

    const index = await ctx.db
      .query('decksIndex')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .unique();
    if (index) await ctx.db.delete(index._id);

    return { slug };
  },
});
