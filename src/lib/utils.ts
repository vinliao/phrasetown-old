import type { CastInterface, EndpointInterface } from '$lib/types';
import linkifyHtml from 'linkify-html';
import "linkify-plugin-mention";
import sanitizeHtml from 'sanitize-html';
import { get, orderBy, transform } from 'lodash-es';
import type { Cast as SearchcasterCast, Root as SearchcasterApiResponse } from '$lib/types/searchcasterCasts';
import type { OpenGraph as PerlOpenGraph, } from '$lib/types/perl';
import type { OpenGraph as MerkleOpenGraph, Cast as MerkleCast, Data as MerkleApiResponse } from '$lib/types/merkleUser';
import type { Cast as MerkleNotificationCast, Data as MerkleNotificationApiResponse } from '$lib/types/merkleNotification';
import type { CastArray as PerlApiResponse, Cast as PerlCast } from '$lib/types/perl';
import * as timeago from 'timeago.js';

/**
 * this function doesn't have params because it uses user's hub key,
 * which is passed from frontend ($userHubKey store)
 * 
 * @returns mention endpoint
 */
function getNotificationEndpoints(): EndpointInterface[] {
  return [
    {
      id: 'eVGJjvV-nABOx8dMqu9ZE',
      name: 'Mentions',
      url: 'https://api.farcaster.xyz/v2/mention-and-reply-notifications',
      type: 'merkleNotification',
    },
  ];
}

/**
 * @returns endpoint to fetch latest casts in the network
 */
function getNewEndpoints(): EndpointInterface[] {
  return [
    {
      id: 'GK-rQ3w0s41xcTeRwVXgw',
      name: 'New',
      url: 'https://api.farcaster.xyz/v2/recent-casts',
      type: 'merkleUser',
    },
  ];
}

/**
 * farlist is farcaster list, think twitter list but farcaster
 * 
 * @returns an array of farlist endpoints
 */
function getFarlistEndpoints(): EndpointInterface[] {
  const farlist = [
    {
      name: "Builders", users: [
        { fid: 1356, username: 'borodutch' },
        { fid: 347, username: 'greg' },
        { fid: 2, username: 'v' },
        { fid: 378, username: 'colin' },
        { fid: 359, username: 'pushix' },
        { fid: 539, username: 'peter' },
        { fid: 451, username: 'pfista' },
      ]
    },
    {
      name: "Interesting", users: [
        { fid: 1001, username: 'mattdesl' },
        { fid: 1946, username: 'dragonbanec' },
        { fid: 5253, username: 'dbkw' },
        { fid: 604, username: 'emodi' },
        { fid: 1287, username: 'july' },
        { fid: 1179, username: 'dbasch' },
        { fid: 528, username: '0xen' },
      ]
    },
    {
      name: "Interesting #2", users: [
        { fid: 267, username: 'aman' },
        { fid: 312, username: 'les' },
        { fid: 5009, username: 'tg' },
        { fid: 4877, username: 'trish' },
        { fid: 2687, username: 'blackdave' },
        { fid: 2714, username: 'rhys' },
        { fid: 1325, username: 'cassie' },
        { fid: 1355, username: 'bias' },
      ]
    },
    {
      name: "Farcaster OG", users: [
        { fid: 129, username: 'phil' },
        { fid: 127, username: 'neuroswish' },
        { fid: 8, username: 'jacob' },
        { fid: 60, username: 'brenner' },
        { fid: 3, username: 'dwr' },
        { fid: 143, username: 'mk' },
      ]
    },
    {
      name: "Cool", users: [
        { fid: 373, username: 'jayme' },
        { fid: 431, username: 'j4ck' },
        { fid: 2458, username: 'rafa' },
        { fid: 617, username: 'cameron' },
        { fid: 576, username: 'nonlinear' },
        { fid: 557, username: 'pugson' },
        { fid: 6319, username: '0xwoid' },
      ]
    }
  ];

  /**
   * loop through farlist, turn it into endpoint, flatten array to 1d
   * (the `.map()` returns a 2d array, because farlist is a 2d array)
   */
  return farlist
    .map((list) => {
      return list.users.map(user => {
        return makeFarlistEndpoint(list.name, user.fid, user.username);
      });
    })
    .flat(1);
}

/**
 * @param listName name of endpoint
 * @param fid
 * @param username used for "recasted by @handle" text
 * @returns the farlist endpoint
 */
function makeFarlistEndpoint(listName: string, fid: number, username: string): EndpointInterface {
  // todo: figure out how to handle this potential undefined
  return {
    id: idOf(listName),
    name: listName,
    url: `https://api.farcaster.xyz/v2/casts?fid=${fid}&includeDeletedCasts=false&limit=15`,
    type: 'merkleUser',
    username: username,
  };
}

/**
 * id here is generated with `npx nanoid`
 * nanoid docs: https://github.com/ai/nanoid
 * 
 * @returns return all endpoint-to-id mapping
 */
function getEndpointIdNameMapping() {
  return [
    { name: 'New', id: 'GK-rQ3w0s41xcTeRwVXgw' },
    { name: 'Mentions', id: 'eVGJjvV-nABOx8dMqu9ZE' },
    { name: 'Home', id: 'REyJisAJvqk4-sjeB4tWW' },
    { name: 'Builders', id: 'ZQ_v4OlpAaRH6UJyB_ZsG' },
    { name: 'Interesting', id: 'rz_mqas0eC-yTTyA5CE_k' },
    { name: 'Interesting #2', id: 'wX7AVGycind3A6hX5gyFn' },
    { name: 'Farcaster OG', id: 'DlX08LLpV8luiFrXboW_n' },
    { name: 'Cool', id: 'H8_KkcycgRmc8JyV7vB9p' },
    { name: '?search=BTC&ETH', id: 'engxPcFaJ0WrtvbnGFoOX' },
    { name: '?search=product', id: 'ESf-K7o8Nu7QmHTp6XLsr' },
    { name: '?search=nouns', id: 'i4HKWuOsocVvY1y3-8gms' },
  ];
}

/**
 * @param name name of endpoint
 * @returns the id of endpoint
 */
export function idOf(name: string): string | undefined {
  const mapping = getEndpointIdNameMapping().find((mapping) => mapping.name === name);
  return mapping ? mapping.id : undefined;
}

/**
 * @returns all endpoints of the app
 */
function getAllEndpoints(): EndpointInterface[] {
  return [
    ...getNewEndpoints(),
    ...getNotificationEndpoints(),
    ...getFarlistEndpoints(),
    ...getSearchcasterEndpoints(),
    ...getHomeEndpoints(import.meta.env.PROD)
  ];
}

/**
 * @param id endpoint id, use idOf() to get it
 * @returns endpoints with that id
 */
export function getEndpoints(id: string | undefined): EndpointInterface[] {
  return getAllEndpoints().filter(endpoint => endpoint.id === id);
}

/**
 * @param id array of endpoint id, use idOf() to get it
 * @returns endpoints where those ids are filtered out
 */
export function getEndpointsWithout(id: (string | undefined)[]): EndpointInterface[] {
  return getAllEndpoints().filter(endpoint => !id.includes(endpoint.id));
}

/**
 * an endpoint is an object which contains all the information to fetch
 * casts, which is then turned into columns
 * 
 * this function returns endpoints to fetch searchcaster
 * 
 * @returns list of unfetched endpoints
 */
function getSearchcasterEndpoints(): EndpointInterface[] {
  const searchlist = [
    { name: "?search=BTC&ETH", queries: ['bitcoin', 'btc', 'ethereum', 'eth+'] },
    { name: "?search=product", queries: ['product', 'startup'] },
    { name: "?search=nouns", queries: ['nouns'] },
  ];

  return searchlist
    .map((list) => {
      return list.queries.map(query => {
        return makeSearchcasterEndpoint(list.name, query);
      });
    })
    .flat(1);
}

/**
 * @param listName name of endpoint
 * @param query the search term
 * @returns the searchcaster endpoint
 */
function makeSearchcasterEndpoint(listName: string, query: string): EndpointInterface {
  return {
    id: idOf(listName),
    name: listName,
    url: `https://searchcaster.xyz/api/search?text=${query}&count=30`,
    type: 'searchcaster',
    nextPage: 1
  };
}

/**
 * endpoint to fetch home feed (/)
 * 
 * it is extremely distracting to have real feed when developing, on
 * dev environment, use the most liked cast instead of "hot 24h" casts,
 * the most liked cast has slow velocity, which means less novelty,
 * which means less distraction
 * 
 * @param isProd whether environment is on prod (import.meta.env.PROD)
 * @returns endpoint to fetch home feed
 */
export function getHomeEndpoints(isProd: boolean): EndpointInterface[] {
  if (isProd) {
    return [
      {
        id: 'REyJisAJvqk4-sjeB4tWW',
        name: 'Home',
        url: `https://searchcaster.xyz/api/search?count=35&engagement=reactions&after=${getUnixTimeMinusXHours(24)}`,
        type: 'searchcaster',
        nextPage: 1
      },
      {
        id: "REyJisAJvqk4-sjeB4tWW",
        name: 'Home',
        url: `https://searchcaster.xyz/api/search?count=15&engagement=replies&after=${getUnixTimeMinusXHours(6)}`,
        type: 'searchcaster',
        nextPage: 1
      },
    ];
  } else {
    return [
      {
        id: 'REyJisAJvqk4-sjeB4tWW',
        name: 'Home',
        url: 'https://searchcaster.xyz/api/search?count=50&engagement=reactions',
        type: 'searchcaster',
        nextPage: 1
      },
    ];
  }
}

/**
 * @param x number in hours
 * @returns unix timestamp of Date.now() minus x
 */
function getUnixTimeMinusXHours(x: number): number {
  return Date.now() - 60 * 60 * x * 1000;
}

/**
 * extract out the jpg link (if there's any)
 * 
 * @param openGraph openGraph object from Merkle's or Perl's API
 * @returns link to image
 */
function getImageLink(openGraph: PerlOpenGraph | MerkleOpenGraph): string | undefined {
  if (typeof openGraph.url === 'string' && openGraph.url !== '') {
    if (/\.(jpg|png|gif)$/.test(openGraph.url)) {
      return openGraph.url;
    }
  } else if (typeof openGraph.image === 'string' && openGraph.image !== '') {
    if (/\.(jpg|png|gif)$/.test(openGraph.image)) {
      return openGraph.image;
    }
  }
}

/**
 * takes raw user cast, replaces all `@name` and links
 * with anchor tags, then sanitize it
 * 
 * the cast component displays raw html content, not string
 * 
 * @param text user's cast in string
 * @returns user's cast as html
 */
export function linkify(text: string): string {
  const linkifyOption = {
    truncate: 30,
    // href needs to be sliced because it starts with `/`
    formatHref: {
      mention: (href: string) => `/@${href.slice(1)}`
    },
  };

  return sanitizeHtml(linkifyHtml(text, linkifyOption));
}

/**
 * @param timestamp unix timestamp
 * @returns text like "4w, 3h, 11mo"
 */
export function getTimeago(timestamp: number): string {
  function enShort(number: number, index: number): [string, string] {
    return [
      ['just now', 'right now'],
      ['%ss ago', 'in %ss'],
      ['1m ago', 'in 1m'],
      ['%sm ago', 'in %sm'],
      ['1h ago', 'in 1h'],
      ['%sh ago', 'in %sh'],
      ['1d ago', 'in 1d'],
      ['%sd ago', 'in %sd'],
      ['1w ago', 'in 1w'],
      ['%sw ago', 'in %sw'],
      ['1mo ago', 'in 1mo'],
      ['%smo ago', 'in %smo'],
      ['1yr ago', 'in 1yr'],
      ['%syr ago', 'in %syr']
    ][index] as [string, string];
  }
  timeago.register('en-short', enShort);
  return timeago.format(timestamp, 'en-short').replace(' ago', '');
}

function removeDuplicate(casts: CastInterface[]): CastInterface[] {
  return [...new Set(casts)];
}

function sortCasts(casts: CastInterface[]): CastInterface[] {
  return orderBy(casts, 'timestamp', 'desc');
}

function transformMerkleCast(cast: MerkleCast, recaster?: string): CastInterface {
  const parent = (cast.parentAuthor && cast.parentHash) ? { username: cast.parentAuthor.username, hash: cast.parentHash } : undefined;
  const recasted = ('recast' in cast && typeof recaster === 'string') ? { username: recaster } : undefined;
  const image = (cast.attachments && cast.attachments.openGraph.length > 0) ? getImageLink(cast.attachments.openGraph[0]) : undefined;

  return {
    author: {
      username: cast.author.username,
      displayName: cast.author.displayName,
      pfp: cast.author.pfp.url,
      fid: cast.author.fid
    },
    parent,
    recasted,
    hash: cast.hash,
    text: linkify(cast.text),
    image,
    timestamp: cast.timestamp,
    likes: cast.reactions.count,
    replies: cast.replies.count,
    recasts: cast.recasts.count,
  };
}

function transformSearchcasterCast(cast: SearchcasterCast) {
  const parent = (typeof cast.body.data.replyParentMerkleRoot === 'string' &&
    typeof cast.meta.replyParentUsername.username === 'string')

    ? { hash: cast.body.data.replyParentMerkleRoot, username: cast.meta.replyParentUsername.username }
    : undefined;

  return {
    author: {
      username: cast.body.username,
      pfp: cast.meta.avatar,
      displayName: cast.meta.displayName,
    },
    parent,
    recasted: undefined,
    text: linkify(cast.body.data.text),
    image: cast.body.data.image,
    timestamp: cast.body.publishedAt,
    likes: cast.meta.reactions.count,
    recasts: cast.meta.recasts.count,
    replies: cast.meta.numReplyChildren,
    hash: cast.merkleRoot,
  };
}

/**
 * todo
 * 
 * @param data 
 * @param type 
 * @param recaster 
 * @returns 
 */
export function transformCasts(casts: any, type: string, recaster?: string): CastInterface[] {
  // todo: naming can be clarified
  if (type == 'merkleUser' || type == 'merkleNotification') {
    return casts.map((cast: MerkleCast) => transformMerkleCast(cast, recaster));
  } else if (type == 'searchcaster') {
    return casts.map((cast: SearchcasterCast) => transformSearchcasterCast(cast));
  }

  // todo: handle error
}

/**
 * =========================
 * code below this line
 * has not been refactored
 * =========================
 */

/**
 * todo
 * 
 * @param data 
 * @param type 
 * @param recaster 
 * @returns 
 */
export function processCast(cast: any, recaster?: string): CastInterface | undefined {
  try {
    let parent;

    // type error here
    if (cast.parentAuthor && cast.parentHash) {
      parent = {
        username: cast.parentAuthor.username,
        hash: cast.parentHash
      };
    }

    // note: mention cast has no "recast" field
    let recasted;
    if ('recast' in cast && typeof recaster === 'string') {
      recasted = {
        username: recaster,
      };
    }

    let image;
    if (cast.attachments && cast.attachments.openGraph.length > 0) {
      // if there's image attached to cast
      image = getImageLink(cast.attachments.openGraph[0]);
    }

    return {
      author: {
        username: cast.author.username,
        displayName: cast.author.displayName,
        pfp: cast.author.pfp.url,
        fid: cast.author.fid
      },
      parent,
      recasted,
      hash: cast.hash,
      text: linkify(cast.text),
      image,
      timestamp: cast.timestamp,
      likes: cast.reactions.count,
      replies: cast.replies.count,
      recasts: cast.recasts.count,
    };


  } catch (e) {
    // if type wrong, don't push the cast, and don't brick the entire app
    console.error(e);
  }

  // todo: handle error
}

function getUrl(url: string, nextPage?: number, cursor?: string) {
  if (nextPage) return `${url}&page=${nextPage}`;
  else if (cursor) return `${url}&cursor=${cursor}`;
  return url;
}

// logic untested
function updateNextPage(endpoint: EndpointInterface, cursor?: string) {
  if (cursor) return { ...endpoint, cursor };
  else if (endpoint.nextPage) return { ...endpoint, nextPage: endpoint.nextPage++ };
  return endpoint;
}

/**
 * fetch endpoints, extract the casts, clean casts, returns it,
 * and also returns the updated endpoints (fetch next page)
 * 
 * todo: split into multiple functions instead of being lumped into one
 * 
 * @param endpoints 
 * @param firstPage if true, fetch next page (with cursor or ?page=X)
 */
export async function fetchEndpoints(endpoints: EndpointInterface[], userHubKey?: string):
  Promise<{ casts: CastInterface[], endpoints: EndpointInterface[]; }> {
  let casts: CastInterface[] = [];
  let endpointWithNext: EndpointInterface[] = [];
  const hubKey = userHubKey ? userHubKey : import.meta.env.VITE_HUB_KEY;

  await Promise.all(
    endpoints.map(async endpoint => {
      if (endpoint.type == 'searchcaster' && endpoint.nextPage) {
        const response = await fetch(getUrl(endpoint.url, endpoint.nextPage));
        const data: SearchcasterApiResponse = await response.json();

        endpointWithNext.push(updateNextPage(endpoint));

        // append the casts
        casts = [...casts, ...transformCasts(data.casts, endpoint.type)];

      }
      else if (endpoint.type == 'merkleUser') {
        const response = await fetch(getUrl(endpoint.url, undefined, endpoint.cursor), {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${hubKey}`
          },
        });

        let data: MerkleApiResponse = await response.json();

        endpointWithNext.push(updateNextPage(endpoint, data.next.cursor));

        casts = [...casts, ...transformCasts(data.result.casts, 'merkleUser', endpoint.username)];
      }

      else if (endpoint.type == 'merkleNotification') {
        const response = await fetch(getUrl(endpoint.url, undefined, endpoint.cursor), {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${hubKey}`
          },
        });

        let data: MerkleNotificationApiResponse = await response.json();
        let rawCasts: MerkleNotificationCast[] = [];
        if ("notifications" in data.result) {
          const notifications = data.result.notifications;
          for (const key in notifications) {
            if (notifications[key].type == 'cast-reply' || notifications[key].type == 'cast-mention') {
              rawCasts.push(notifications[key].content.cast);
            }
          }
        }

        endpointWithNext.push(updateNextPage(endpoint, data.next.cursor));

        casts = [...casts, ...transformCasts(rawCasts, 'merkleNotification', endpoint.username)];
      }

    })
  );

  return { casts: sortCasts(removeDuplicate(casts)), endpoints: endpointWithNext };
}

/**
* returns upstash name, uesd for fetching cached casts
*/
export function getUpstashName() {
  if (import.meta.env.PROD) {
    return {
      upstashColumnName: "prod_phrasetown_home",
      upstashEndpointName: "prod_phrasetown_home_endpoints"
    };
  } else if (import.meta.env.PROD && import.meta.env.BASE_URL.startsWith('dev')) {
    return {
      upstashColumnName: "dev_phrasetown_home",
      upstashEndpointName: "dev_phrasetown_home_endpoints"
    };
  } else {
    return {
      upstashColumnName: "local_phrasetown_home",
      upstashEndpointName: "local_phrasetown_home_endpoints"
    };
  }
}

/**
 * take casts, endpoints, fetch from endpoint, append to cast
 * returns the appended casts and the new endpoints
 * 
 * @param casts casts to append
 * @param endpoints list of endpoints to fetch from
 */
export async function fetchMore(casts: CastInterface[], endpoints: EndpointInterface[]) {
  const response = await fetch('/api/fetch-more', {
    method: 'PUT',
    body: JSON.stringify({ endpoints })
  });

  const data = await response.json();
  const newCasts: CastInterface[] = data.casts;
  if (newCasts) {
    return { casts: [...new Set([...casts, ...newCasts])], endpoints: data.endpoints };
  }
}