import { fetchEndpoints, getFeedEndpoints, getHomeEndpoints, getUpstashName } from "$lib/utils";
import type { PageServerLoad } from './$types';
import { decode } from 'js-base64';

export const load: PageServerLoad = async ({ params }) => {

  /**
   * todo:
   * if data on redis doesn't exist, curl the cache-home endpoint to fill it
   * if data on redis exist, use it instead
   */
  const upstashUrl = import.meta.env.VITE_UPSTASH_URL;
  const upstashKey = import.meta.env.VITE_UPSTASH_KEY;
  const { upstashColumnName, upstashEndpointName } = getUpstashName();

  const homeResponse = await fetch(`${upstashUrl}/get/${upstashColumnName}`, {
    headers: {
      Authorization: `Bearer ${upstashKey}`
    },
  });

  const endpointResponse = await fetch(`${upstashUrl}/get/${upstashEndpointName}`, {
    headers: {
      Authorization: `Bearer ${upstashKey}`
    },
  });

  const homeDataBase64 = await homeResponse.json();
  const columnEndpointsBase64 = await endpointResponse.json();

  const homeString = decode(homeDataBase64.result);
  const columnEndpointsString = decode(columnEndpointsBase64.result);
  const home = JSON.parse(homeString);
  const columnEndpoints = JSON.parse(columnEndpointsString);

  // this should be done as a fallback or something
  // const { casts, endpoints } = await fetchEndpoints(getHomeEndpoints());

  // return {
  //   casts, endpoints, home
  // };
  return { casts: home.casts, endpoints: home.endpoints };
};