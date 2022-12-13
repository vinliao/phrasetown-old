import { getFeedEndpoints, fetchEndpoints } from '$lib/utils';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, url }) => {
  const response = await fetch(`https://api.farcaster.xyz/v2/cast?hash=0x0c5c9cced98e63696a01e29ab1ffaa211119743394bf61ae0f35ea7772af4439`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_HUB_KEY}`
    },
  });
  // const data = fetchEndpoints(getFeedEndpoints('K7S4kH22qNGuZ_dlLQVEz'));
  return json(await response.json());
};