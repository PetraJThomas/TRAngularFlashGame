# Publishing Quiz Sets to FlashcardStudio

This document describes how an external app publishes quiz decks to the
FlashcardStudio Convex backend. The game reads decks live from Convex, so a
successful publish makes the new deck available immediately on the start screen.

## Endpoints

Write operations go through HTTPS endpoints on Convex's `.site` domain
(**not** `.cloud`) and require a bearer token.

- **Base URL:** `https://notable-frog-519.convex.site`
- **Auth:** every write request must include
  `Authorization: Bearer <IMPORT_SECRET>`. Requests without it return 401.
- **Secret rotation:** the secret lives in the Convex deployment's env vars
  (`npx convex env set IMPORT_SECRET <new-value>`). The new value takes effect
  on the next deploy/run.

| Endpoint                       | Purpose                                                              |
| ------------------------------ | -------------------------------------------------------------------- |
| `POST /import-deck`            | Insert or replace a deck and its questions.                          |
| `POST /delete-deck`            | Remove a deck, its questions, and its index entry.                   |
| `POST /refresh-index`          | Rebuild `decksIndex` from the source tables. Optional repair step.   |

Reads (`listDecks`, `getDeckQuestions`, `getAllQuestions`) remain on the
standard Convex query API (`https://notable-frog-519.convex.cloud`) and are
unauthenticated.

## Quiz JSON format

POST body for `/import-deck`:

```json
{
  "slug": "rxjs",
  "name": "RxJS & Observables",
  "questions": [
    {
      "question": "What does RxJS stand for?",
      "answers": [
        "Reactive Extensions for JavaScript",
        "Really eXtra JavaScript",
        "Robust eXchange JavaScript"
      ],
      "correctAnswer": "Reactive Extensions for JavaScript"
    }
  ]
}
```

### Field rules (enforced server-side; invalid input returns 400)

- `slug` — non-empty string. Stable identifier; reusing a slug **replaces** that
  deck's questions and updates its name.
- `name` — non-empty string. Display name shown in the UI.
- `questions` — non-empty array.
- Each question:
  - `question` — non-empty string.
  - `answers` — array of **at least 2** non-empty strings.
  - `correctAnswer` — non-empty string that **exactly matches** one entry in
    `answers`.

If any rule fails, the response body is a plain-text error like
`Question 3: correctAnswer must match one of the answers`.

## Example: curl

```sh
curl -X POST https://notable-frog-519.convex.site/import-deck \
  -H "Authorization: Bearer $IMPORT_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "rxjs",
    "name": "RxJS & Observables",
    "questions": [
      {
        "question": "What does RxJS stand for?",
        "answers": ["Reactive Extensions for JavaScript", "Really eXtra JavaScript"],
        "correctAnswer": "Reactive Extensions for JavaScript"
      }
    ]
  }'
```

Successful response (200):

```json
{ "slug": "rxjs", "count": 1 }
```

Validation failure (400) returns the error message as the body text.

## Example: TypeScript / JavaScript

No SDK required — plain `fetch` is enough:

```ts
async function publishDeck(deck: {
  slug: string;
  name: string;
  questions: { question: string; answers: string[]; correctAnswer: string }[];
}) {
  const res = await fetch('https://notable-frog-519.convex.site/import-deck', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.IMPORT_SECRET}`,
    },
    body: JSON.stringify(deck),
  });
  if (!res.ok) throw new Error(`Publish failed: ${await res.text()}`);
  return res.json() as Promise<{ slug: string; count: number }>;
}
```

## Other write endpoints

### `POST /delete-deck`

Body:

```json
{ "slug": "rxjs" }
```

Response: `{ "slug": "rxjs" }`

### `POST /refresh-index`

Body: `{}` (empty object).

Rebuilds `decksIndex` from `decks` + `questions`. Only needed if the data was
edited outside `/import-deck` (e.g. via the Convex dashboard). Routine
publishes do not need to call this — `/import-deck` already keeps the index
in sync per deck.

Response: `{ "decks": <number> }`

## Read API (no auth required)

If your app also needs to display decks, use the standard Convex client:

```ts
import { ConvexHttpClient } from 'convex/browser';
import { anyApi } from 'convex/server';

const client = new ConvexHttpClient('https://notable-frog-519.convex.cloud');

await client.query(anyApi.decks.listDecks, {});             // [{ slug, name, count }]
await client.query(anyApi.decks.getDeckQuestions, { slug }); // Question[]
await client.query(anyApi.decks.getAllQuestions, {});        // Question[]
```

## Behavior summary

| Action                      | Effect                                                                        |
| --------------------------- | ----------------------------------------------------------------------------- |
| `/import-deck` with new slug  | Inserts deck + questions, adds index entry.                                 |
| `/import-deck` with same slug | Updates name, **deletes all old questions**, inserts new ones, updates index. |
| `/delete-deck`                | Removes deck, questions, and index entry.                                   |

## Common pitfalls

- **Wrong domain:** writes go to `*.convex.site`, reads go to `*.convex.cloud`.
  They are different hosts.
- **Trailing slash on the URL** returns Cloudflare 404 HTML. Strip trailing
  slashes before passing to any client.
- **`correctAnswer` typos** — the string must match an entry in `answers`
  byte-for-byte. Whitespace and punctuation count.
- **Empty `questions` array** is rejected. Send at least one question.
- **CORS:** the endpoints respond to preflight `OPTIONS` and allow any origin,
  but treat the secret as a server-side credential — do not embed it in browser
  code shipped to end users.
