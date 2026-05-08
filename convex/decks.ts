import { query } from './_generated/server';
import { v } from 'convex/values';

export const listDecks = query({
  args: {},
  handler: async (ctx) => {
    const entries = await ctx.db.query('decksIndex').collect();
    return entries
      .map((e) => ({ slug: e.slug, name: e.name, count: e.count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  },
});

export const getDeckQuestions = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const rows = await ctx.db
      .query('questions')
      .withIndex('by_deck', (q) => q.eq('deckSlug', slug))
      .collect();
    return rows.map(({ question, answers, correctAnswer }) => ({
      question,
      answers,
      correctAnswer,
    }));
  },
});

export const getAllQuestions = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query('questions').collect();
    return rows.map(({ question, answers, correctAnswer }) => ({
      question,
      answers,
      correctAnswer,
    }));
  },
});
