import { error, json } from '@sveltejs/kit';
import type { PageServerLoad } from '../../../.svelte-kit/types/src/routes/[fname]/$types';
import type { Data as MerkleUserRoot } from '$lib/types/merkleUser';
import { transformCasts } from '$lib/utils';
import type { CastInterface } from '$lib/types';
import type { Data, User } from '$lib/types/merkleUserByUsername';

async function getUser(fname: string): Promise<User> {
  const response = await fetch(`https://api.farcaster.xyz/v2/user-by-username?username=${fname}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_HUB_KEY}`
    },
  });
  const data: Data = await response.json();
  console.log(data);
  return data.result.user;
}

export const load: PageServerLoad = async ({ params }) => {
  if (params.fname.startsWith('@') && typeof params.fname === 'string') {
    const fname = params.fname.slice(1);
    const user = await getUser(fname);

    const hubKey = import.meta.env.VITE_HUB_KEY;
    const response = await fetch(`https://api.farcaster.xyz/v2/casts?fid=${user.fid}&includeDeletedCasts=false&limit=50`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hubKey}`
      },
    });

    const data: MerkleUserRoot = await response.json();
    const casts: CastInterface[] = transformCasts(data.result.casts, 'merkleUser', user.username);

    // recast is top-level cast
    const topLevelCasts = casts.filter(cast => !cast.parent || cast.recasted);
    const replyCasts = casts.filter(cast => cast.parent && !cast.recasted);

    return { user: user, topLevelCasts, replyCasts };
  }

  throw error(404, 'Not found');
};