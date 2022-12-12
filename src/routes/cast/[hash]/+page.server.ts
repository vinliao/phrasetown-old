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

/**
 * turn data form mekrle's api (get all replies)
 * and turn them into a recursive children
 */
// get ancestors?
function turnIntoThread(data: Root) {
  // recursively loop through the castPool
  let casts = data.result.casts;
  casts.forEach(parent => {
    casts.forEach(cast => {
      if (parent.hash == cast.parentHash) {

      }
    });
  });
  // while (castPool.length > 0) {
  //   const cast = castPool[index];

  //   if (index == castPool.length) index = 0;
  //   index++
  // }
}

// function getAncestors(data: Root, hash: string, threadHash: string): CastInterface[] | undefined {
//   if (hash == threadHash) return undefined;

//   let thread: Cast[] = [];
//   let ancestors: CastInterface[] = [];
//   let currentHash = hash;
//   data.result.casts.forEach(cast => {
//     if (cast.hash == currentHash) thread.push(cast);
//     // if (cast.hash == hash) ancestors.push(processCasts(cast, 'merkle'));
//   });

//   return ancestors;
// }

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
    processedCasts.push(processCast(cast, 'merkle')!);

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

// not done
function nestCasts(data: Root) {
  const casts = data.result.casts;
  // Create an empty array to store the nested structure
  const nestedCasts = [];

  // Iterate over the array of objects
  for (const cast of casts) {
    const newCast = processCast(cast);
    if (newCast) {
      if (!newCast.parent) { nestedCasts.push(newCast); }
      else {
        const parentCast = nestedCasts.find(obj => obj.hash === cast.parentHash);
        parentCast?.children.push(newCast);
        // parentCast?.children.push(processCasts([newCast], 'merkle')[0]);
        // parentObject.children.push(newObject);
      }

      // if (!object.parentId) {
      //   // If the object doesn't have a parentId property, add the new object to the array
      //   nestedArray.push(newObject);
      // } else {
      //   // If the object has a parentId property, add the new object to the children array of the object with the parentId as the id property
      //   const parentObject = nestedArray.find(obj => obj.id === object.parentId);
      //   parentObject.children.push(newObject);
      // }
    }
  }

  // Return the nested array
  return nestedCasts;
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