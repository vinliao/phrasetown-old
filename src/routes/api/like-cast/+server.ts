import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '../../../../.svelte-kit/types/src/routes/api/show-profile copy/$types';

export const PUT: RequestHandler = async ({ request }) => {
  const { castHash, userHubKey } = await request.json();

  const response = await fetch(`https://api.farcaster.xyz/v2/cast-likes`, {
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