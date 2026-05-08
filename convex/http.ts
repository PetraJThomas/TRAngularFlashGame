import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { internal } from './_generated/api';

const http = httpRouter();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function checkBearer(req: Request): Response | null {
  const expected = process.env['IMPORT_SECRET'];
  if (!expected) {
    return new Response('Server misconfigured: IMPORT_SECRET not set', {
      status: 500,
      headers: corsHeaders,
    });
  }
  const header = req.headers.get('Authorization') ?? '';
  const provided = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (provided !== expected) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders });
  }
  return null;
}

const importDeckHandler = httpAction(async (ctx, req) => {
  const unauth = checkBearer(req);
  if (unauth) return unauth;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400, headers: corsHeaders });
  }

  try {
    const result = await ctx.runMutation(internal.import.importDeck, body as any);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(message, { status: 400, headers: corsHeaders });
  }
});

const deleteDeckHandler = httpAction(async (ctx, req) => {
  const unauth = checkBearer(req);
  if (unauth) return unauth;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400, headers: corsHeaders });
  }

  try {
    const result = await ctx.runMutation(internal.import.deleteDeck, body as any);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(message, { status: 400, headers: corsHeaders });
  }
});

const refreshIndexHandler = httpAction(async (ctx, req) => {
  const unauth = checkBearer(req);
  if (unauth) return unauth;
  try {
    const result = await ctx.runMutation(internal.admin.refreshIndex, {});
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(message, { status: 400, headers: corsHeaders });
  }
});

const preflight = httpAction(async () => new Response(null, { status: 204, headers: corsHeaders }));

http.route({ path: '/import-deck', method: 'POST', handler: importDeckHandler });
http.route({ path: '/import-deck', method: 'OPTIONS', handler: preflight });
http.route({ path: '/delete-deck', method: 'POST', handler: deleteDeckHandler });
http.route({ path: '/delete-deck', method: 'OPTIONS', handler: preflight });
http.route({ path: '/refresh-index', method: 'POST', handler: refreshIndexHandler });
http.route({ path: '/refresh-index', method: 'OPTIONS', handler: preflight });

export default http;
