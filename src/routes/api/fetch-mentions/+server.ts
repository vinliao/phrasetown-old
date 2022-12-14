import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '../../../../.svelte-kit/types/src/routes/api/fetch-mentions/$types';
import { fetchEndpoints, getEndpoints, idOf } from '$lib/utils';

export const PUT: RequestHandler = async ({ request }) => {
  const { userHubKey } = await request.json();
  if (userHubKey) {
    const data = await fetchEndpoints(getEndpoints(idOf('Mentions')), userHubKey);
    return json({ casts: data.casts, endpoints: data.endpoints });
  }

  throw error(500, 'user hub key must exist');
};