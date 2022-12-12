import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '../../../../.svelte-kit/types/src/routes/api/get-home-data/$types';
import { fetchEndpoints, getHomeEndpoints } from '$lib/utils';
import { encode } from 'js-base64';
import { getUpstashName } from '$lib/utils';

export const POST: RequestHandler = async () => {

  const endpoints = getHomeEndpoints();
  const data = await fetchEndpoints(endpoints);

  const upstashUrl = import.meta.env.VITE_UPSTASH_URL;
  const upstashKey = import.meta.env.VITE_UPSTASH_KEY;

  const homeDataBase64 = encode(JSON.stringify(data));
  const endpointsBase64 = encode(JSON.stringify(endpoints));

  const { upstashColumnName, upstashEndpointName } = getUpstashName();

  const columnResponse = await fetch(`${upstashUrl}/set/${upstashColumnName}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${upstashKey}`
    },
    body: homeDataBase64
  });

  const endpointResponse = await fetch(`${upstashUrl}/set/${upstashEndpointName}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${upstashKey}`
    },
    body: endpointsBase64
  });

  if (columnResponse.status == 200 && endpointResponse.status == 200) {
    return json({ success: 'OK' });
  }

  throw error(500, 'Error in posting data to Upstash');
};