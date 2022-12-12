import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ request }) => {
  const { userHubKey } = await request.json();

  const response = await fetch('https://api.farcaster.xyz/v2/me',
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userHubKey}`
      },
    }
  );

  const data = await response.json();

  return json({ username: data.result.user.username, fid: data.result.user.fid });
};