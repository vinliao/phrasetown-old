import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '../../../../.svelte-kit/types/src/routes/api/show-profile copy/$types';

export const PUT: RequestHandler = async ({ request }) => {
  const { castHash, userHubKey } = await request.json();

  if (!castHash) throw error(500, 'like cast must have parameter cast hash and author fid');

  const response = await fetch(`https://api.farcaster.xyz/v2/recasts`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userHubKey}`
    },
    body: JSON.stringify({ castHash })
  });

  if (response.status == 200) {
    return json({ status: 'OK' });
  }

  throw error(500, 'something wrong with liking cast');
};