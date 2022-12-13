import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../../../../.svelte-kit/types/src/routes/api/get-user-by-username/$types';

// get request, use local hubkey instead
export const GET: RequestHandler = async ({ url }) => {
  console.log(url);
  const username = url.searchParams.get('username');
  console.log(username);
  const response = await fetch(`https://api.farcaster.xyz/v2/user-by-username?username=${username}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_HUB_KEY}`
    },
  });
  return json({ data: await response.json() });
};