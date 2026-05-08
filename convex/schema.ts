import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  decks: defineTable({
    slug: v.string(),
    name: v.string(),
  }).index('by_slug', ['slug']),

  questions: defineTable({
    deckSlug: v.string(),
    question: v.string(),
    answers: v.array(v.string()),
    correctAnswer: v.string(),
  }).index('by_deck', ['deckSlug']),

  decksIndex: defineTable({
    slug: v.string(),
    name: v.string(),
    count: v.number(),
  }).index('by_slug', ['slug']),
});
