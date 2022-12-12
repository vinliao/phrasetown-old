import { error, json } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { processCasts, processCast } from '$lib/utils';
// import type { Root as SearchcasterRoot } from '$lib/types/searchcaster';
import type { Root, Cast } from '$lib/types/merkleAllReply';
import type { CastInterface } from '$lib/types';


async function getThreadHash(hash: string) {
  const response = await fetch(`https://api.farcaster.xyz/v2/cast?hash=${hash}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_HUB_KEY}`
    },
  });
  const data = await response.json();
  return data.result.cast.threadHash;
}

async function getReplies(hash: string): Promise<Root> {
  const response = await fetch(`https://api.farcaster.xyz/v2/all-casts-in-thread?threadHash=${hash}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_HUB_KEY}`
    },
  });
  return response.json();
}

function getAncestors(hash: string, data: Root): CastInterface[] {
  let ancestorChain = [];
  let currentHash: string | undefined = hash;
  const casts = data.result.casts;
  while (currentHash) {
    let currentCast = casts.find(cast => cast.hash === currentHash);
    if (!currentCast) break;
    ancestorChain.unshift(currentCast);
    currentHash = currentCast.parentHash;
  }

  // this is not elegant, abstract this
  let processedCasts: CastInterface[] = [];
  ancestorChain.forEach(cast => {
    let processedCast = processCast(cast, 'merkle');
    if (processedCast) {
      processedCast.parent = undefined;
      processedCasts.push(processedCast);
    }
  });
  return processedCasts;
}

function getChildren(hash: string, data: Root) {
  const casts = data.result.casts.filter(cast => cast.parentHash === hash);
  let processedCasts: CastInterface[] = [];
  casts.forEach(cast => {
    processedCasts.push(processCast(cast, 'merkle')!);

  });
  return processedCasts;
}

export const load: PageServerLoad = async ({ params }) => {
  if (params.hash.startsWith('0x') && typeof params.hash === 'string' && params.hash.length == 66) {
    const hash = params.hash;
    const threadHash = await getThreadHash(hash);
    const replies = await getReplies(threadHash);
    const ancestors = getAncestors(hash, replies);
    const children = getChildren(hash, replies);
    return { ancestors, children };
  }

  throw error(404, 'Not found');
};