import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, url }) => {
  const response = await fetch(`https://api.farcaster.xyz/v2/all-casts-in-thread?threadHash=0xa113f9b79bf77aa149a9420736de447dcc89cd8fd2386566c12cabc9ebb050a6`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_HUB_KEY}`
    },
  });
  return json(await response.json());
};