import { getFeedEndpoints, fetchEndpoints } from '$lib/utils';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, url }) => {
  // const response = await fetch(`https://api.farcaster.xyz/v2/user-by-username?username=deodad`, {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${import.meta.env.VITE_HUB_KEY}`
  //   },
  // });
  const data = fetchEndpoints(getFeedEndpoints('K7S4kH22qNGuZ_dlLQVEz'));
  return json(data);
};