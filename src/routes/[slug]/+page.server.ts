import { error, json } from '@sveltejs/kit';
import type { PageServerLoad } from '../../../.svelte-kit/types/src/routes/[slug]/$types';
import type { Root as SearchcasterRoot } from '$lib/types/searchcasterUser';
import type { Data as MerkleUserRoot } from '$lib/types/merkleUser';
import { processCasts } from '$lib/utils';
import type { CastInterface } from '$lib/types';

async function getBio(fname: string) {
  const bioUrl = `https://searchcaster.xyz/api/profiles?username=${fname}`;
  const bioResponse = await fetch(bioUrl);
  return bioResponse.json();
}

export const load: PageServerLoad = async ({ params }) => {
  if (params.slug.startsWith('@') && typeof params.slug === 'string') {
    // if fname
    const fname = params.slug.slice(1);
    const bioResponse: SearchcasterRoot = await getBio(fname);
    const bio = bioResponse[0];

    const hubKey = import.meta.env.VITE_HUB_KEY;
    const response = await fetch(`https://api.farcaster.xyz/v2/casts?fid=${bio.body.id}&includeDeletedCasts=false&limit=50`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hubKey}`
      },
    });

    const data: MerkleUserRoot = await response.json();
    const casts: CastInterface[] = processCasts(data, 'merkle', bio.body.username);

    // recast is top-level cast
    const topLevelCasts = casts.filter(cast => !cast.parent || cast.recasted);
    const replyCasts = casts.filter(cast => cast.parent && !cast.recasted);

    return { bio: bio.body, topLevelCasts, replyCasts };
  }

  throw error(404, 'Not found');
};