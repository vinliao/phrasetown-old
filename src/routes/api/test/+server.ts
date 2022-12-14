import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getEndpointsWithout, idOf } from '$lib/utils';

export const GET: RequestHandler = async () => {
  return json({
    asd: [idOf('Home'), idOf('Mentions')],
    data: getEndpointsWithout([idOf('Mentions'), idOf('New'), idOf('Home')])
  });
};