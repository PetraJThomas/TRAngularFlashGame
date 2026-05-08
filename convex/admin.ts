import { internalMutation } from './_generated/server';

/**
 * Recompute every entry in `decksIndex` from the source of truth (`decks` and
 * `questions`). Use after manual data edits or as a repair step.
 */
export const refreshIndex = internalMutation({
  args: {},
  handler: async (ctx) => {
    const current = await ctx.db.query('decksIndex').collect();
    for (const entry of current) {
      await ctx.db.delete(entry._id);
    }

    const decks = await ctx.db.query('decks').collect();
    for (const deck of decks) {
      const questions = await ctx.db
        .query('questions')
        .withIndex('by_deck', (q) => q.eq('deckSlug', deck.slug))
        .collect();
      await ctx.db.insert('decksIndex', {
        slug: deck.slug,
        name: deck.name,
        count: questions.length,
      });
    }

    return { decks: decks.length };
  },
});
