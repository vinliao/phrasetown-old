import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { castText, replyTo, fid, userHubKey } = await request.json();
  if (!castText) throw error(500, 'cast text cannot be empty');
  if (castText.length > 320) throw error(500, 'cast text cannot exceed 320 characters');

  interface castPayloadInterface {
    text: string,
    parent?: { hash: string, fid: number; };
    embeds?: string[];
  }
  let payload: castPayloadInterface = { text: castText };
  if (replyTo) payload.parent = { hash: replyTo, fid };

  const response = await fetch(`https://api.farcaster.xyz/v2/casts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userHubKey}`
    },
    body: JSON.stringify(payload)
  });

  if (response.ok) {
    return new Response(String('Send cast OK'));
  }

  throw error(500, 'error when trying to send cast');
};
