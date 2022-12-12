import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../../../../.svelte-kit/types/src/routes/api/get-user-by-username/$types';

export const PUT: RequestHandler = async ({ request }) => {
  const { username, hubKey } = await request.json();
  const response = await fetch(`https://api.farcaster.xyz/v2/user-by-username?username=${username}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${hubKey}`
    },
  });
  const data = await response.json();

  return json({ fid: data.result.user.fid });
};