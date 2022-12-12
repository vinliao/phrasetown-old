import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { processCasts } from '$lib/utils';

export const GET: RequestHandler = async ({ url }) => {
  const username = url.searchParams.get('username');
  const bioUrl = `https://searchcaster.xyz/api/profiles?username=${username}`;
  const bioResponse = await fetch(bioUrl);
  const bioData = await bioResponse.json();
  const bio = {
    fid: bioData[0].body.id,
    mainAddress: bioData[0].connectedAddress,
    pfp: bioData[0].body.avatarUrl,
    bioText: bioData[0].body.bio,
    displayName: bioData[0].body.displayName,
    username: bioData[0].body.username
  };

  const hubKey = import.meta.env.VITE_HUB_KEY;
  const response = await fetch(`https://api.farcaster.xyz/v2/casts?fid=${bio.fid}&includeDeletedCasts=false&limit=50`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${hubKey}`
    },
  });

  const data = await response.json();
  const casts = processCasts(data.result.casts, 'merkle', bio.username);
  // recast is top-level cast
  const topLevelCasts = casts.filter(cast => !cast.parent || cast.recasted);
  const replyCasts = casts.filter(cast => cast.parent && !cast.recasted);

  return json({ bio, topLevelCasts, replyCasts });
};