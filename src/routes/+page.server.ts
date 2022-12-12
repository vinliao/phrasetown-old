import { getUpstashName } from "$lib/utils";
import type { PageServerLoad } from './$types';
import { decode, encode } from 'js-base64';
import type { CastInterface, EndpointMetadataInterface } from "$lib/types";
import { fetchEndpoints, getHomeEndpoints } from '$lib/utils';

async function fetchFromUpstash(): (Promise<{ casts: CastInterface[], endpoints: EndpointMetadataInterface[]; } | undefined>) {
  try {

    const upstashUrl = import.meta.env.VITE_UPSTASH_URL;
    const upstashKey = import.meta.env.VITE_UPSTASH_KEY;
    const { upstashColumnName } = getUpstashName();

    const homeResponse = await fetch(`${upstashUrl}/get/${upstashColumnName}`, {
      headers: {
        Authorization: `Bearer ${upstashKey}`
      },
    });

    const dataBase64 = await homeResponse.json();
    const dataString = decode(dataBase64.result);
    const data = JSON.parse(dataString);
    return { casts: data.casts, endpoints: data.endpoints };
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

async function saveToUpstash(data: { casts: CastInterface[], endpoints: EndpointMetadataInterface[]; }) {
  const upstashUrl = import.meta.env.VITE_UPSTASH_URL;
  const upstashKey = import.meta.env.VITE_UPSTASH_KEY;

  const dataBase64 = encode(JSON.stringify(data));

  const { upstashColumnName, upstashEndpointName } = getUpstashName();

  await fetch(`${upstashUrl}/set/${upstashColumnName}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${upstashKey}`
    },
    body: dataBase64
  });
}

export const load: PageServerLoad = async ({ params }) => {
  const data = await fetchFromUpstash();
  if (data) return { casts: data.casts, endpoints: data.endpoints };
  else {
    console.log('have to fetch manually!');
    const endpoints = getHomeEndpoints();
    const data = await fetchEndpoints(endpoints);
    await saveToUpstash(data);
    return { casts: data.casts, endpoints: data.endpoints };
  }
};