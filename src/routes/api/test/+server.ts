import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getEndpoints, getEndpointsWithout, idOf } from '$lib/utils';

export const GET: RequestHandler = async () => {
  return json({
    data: getEndpointsWithout([idOf('Mentions'), idOf('New'), idOf('Home')])
  });
};