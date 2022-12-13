import type { CastInterface, EndpointInterface } from '$lib/types';
import linkifyHtml from 'linkify-html';
import "linkify-plugin-mention";
import sanitizeHtml from 'sanitize-html';
import { orderBy } from 'lodash-es';
import type { Cast as SearchcasterCast, Root as SearchcasterApiResponse } from '$lib/types/searchcasterCasts';
import type { OpenGraph as PerlOpenGraph, } from '$lib/types/perl';
import type { OpenGraph as MerkleOpenGraph, Cast as MerkleCast, Data as MerkleApiResponse } from '$lib/types/merkleUser';
import type { Cast as MerkleNotification, Data as MerkleNotificationApiResponse } from '$lib/types/merkleNotification';
import type { CastArray as PerlApiResponse, Cast as PerlCast } from '$lib/types/perl';
import * as timeago from 'timeago.js';

/**
 * an endpoint is an object which contains all the information to fetch
 * casts, which is then turned into feed
 * 
 * this function returns endpoints specifically for notification
 * 
 * @param fid connected user fid
 * @param username connected user username
 * @returns list of unfetched endpoints
 */
export function getNotificationEndpoints(): EndpointInterface[] {
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
 * an endpoint is an object which contains all the information to fetch
 * casts, which is then turned into feed
 * 
 * farlist is "twitter list but for farcaster users"
 * 
 * @returns list of unfetched endpoints
 */
function getFarlistEndpoints(): EndpointInterface[] {
  let listEndpoint: EndpointInterface[] = [];

  const farlist = [
    {
      name: "Builders", id: 'ZQ_v4OlpAaRH6UJyB_ZsG', users: [
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
      name: "Interesting", id: 'rz_mqas0eC-yTTyA5CE_k', users: [
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
      name: "Interesting #2", id: 'wX7AVGycind3A6hX5gyFn', users: [
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
      name: "Farcaster OG", id: 'DlX08LLpV8luiFrXboW_n', users: [
        { fid: 129, username: 'phil' },
        { fid: 127, username: 'neuroswish' },
        { fid: 8, username: 'jacob' },
        { fid: 60, username: 'brenner' },
        { fid: 3, username: 'dwr' },
        { fid: 143, username: 'mk' },
      ]
    },
    {
      name: "Cool", id: 'H8_KkcycgRmc8JyV7vB9p', users: [
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

  farlist.forEach(list => {
    list.users.forEach(user => {
      listEndpoint.push({
        id: list.id,
        name: list.name,
        url: `https://api.farcaster.xyz/v2/casts?fid=${user.fid}&includeDeletedCasts=false&limit=15`,
        type: 'merkle',
        username: user.username
      });
    });
  });

  return listEndpoint;
}

/**
 * an endpoint is an object which contains all the information to fetch
 * casts, which is then turned into columns
 * 
 * this endpoint is for fetching the recent cast in the network
 * 
 * @returns list of unfetched endpoints
 */
function getNewEndpoints(): EndpointInterface[] {
  return [
    {
      id: 'GK-rQ3w0s41xcTeRwVXgw',
      name: 'New',
      url: 'https://api.farcaster.xyz/v2/recent-casts',
      type: 'merkle',
    },
  ];
}

/**
 * an endpoint is an object which contains all the information to fetch
 * casts, which is then turned into columns
 * 
 * this function returns endpoints to fetch searchcaster
 * 
 * @returns list of unfetched endpoints
 */
function getOtherEndpoints(): EndpointInterface[] {
  let listEndpoint: EndpointInterface[] = [];

  const searchlist = [
    { name: "?search=BTC&ETH", id: 'engxPcFaJ0WrtvbnGFoOX', searchTerms: ['bitcoin', 'btc', 'ethereum', 'eth+'] },
    { name: "?search=product", id: 'ESf-K7o8Nu7QmHTp6XLsr', searchTerms: ['product', 'startup'] },
  ];

  searchlist.forEach(search => {
    search.searchTerms.forEach(term => {
      listEndpoint.push({
        id: search.id,
        name: search.name,
        url: `https://searchcaster.xyz/api/search?text=${term}&count=30`,
        type: 'searchcaster',
        nextPage: 1
      });
    });
  });

  return [
    /**
     * todo: code to process perl is still buggy
     */
    // {
    //   id: 'K7S4kH22qNGuZ_dlLQVEz',
    //   name: 'Perl',
    //   url: 'https://api.perl.xyz/shuffled-perls',
    //   type: 'perl',
    //   nextPage: 1
    // },
    {
      id: 'i4HKWuOsocVvY1y3-8gms',
      name: '?search=nouns',
      url: 'https://searchcaster.xyz/api/search?text=nouns&count=30',
      type: 'searchcaster',
      nextPage: 1
    },
    ...listEndpoint
  ];
}

/**
 * @param id (optional) if not specified, return all endpoint
 * @returns 
 */
export function getFeedEndpoints(id?: string) {
  const allEndpoints = [...getNewEndpoints(), ...getFarlistEndpoints(), ...getOtherEndpoints(), ...getHomeEndpoints()];

  if (id) {
    return allEndpoints.filter(object => object.id === id);
  }

  return allEndpoints;
}

/**
 * this is the endpoint for fetching the home page
 * on development environment, returns the most upvoted casts as feed
 * the feed updates infrequently, means less novelty, good for 
 * development purposes, the "Dev" feed should be purged on production
 */
export function getHomeEndpoints(): EndpointInterface[] {
  if (import.meta.env.PROD) {
    return [
      {
        id: 'REyJisAJvqk4-sjeB4tWW',
        name: 'Hot',
        url: `https://searchcaster.xyz/api/search?count=35&engagement=reactions&after=${getUnixTimeMinusXHours(24)}`,
        type: 'searchcaster',
        nextPage: 1
      },
      {
        id: "REyJisAJvqk4-sjeB4tWW",
        name: 'Hot',
        url: `https://searchcaster.xyz/api/search?count=15&engagement=replies&after=${getUnixTimeMinusXHours(6)}`,
        type: 'searchcaster',
        nextPage: 1
      },
    ];
  } else {
    return [
      {
        id: 'AaH8H3KduTTPVIdFFEqkR',
        name: 'Dev',
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
function linkify(text: string): string {
  const linkifyOption = {
    truncate: 30,
    // href needs to be sliced because it starts with `/`
    formatHref: {
      mention: (href: string) => `/@${href.slice(1)}`
    },
  };

  const rawHtml = linkifyHtml(text, linkifyOption);
  return sanitizeHtml(rawHtml);
}

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

/**
 * @param data api response from merkle's api endpint
 * @returns array of casts, ready to be displayed
 */
function processMerkleCasts(data: MerkleApiResponse, recaster?: string): CastInterface[] {
  let result: CastInterface[] = [];
  data.result.casts.forEach((cast: MerkleCast) => {
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

      result.push({
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
      });


    } catch (e) {
      // if type wrong, don't push the cast, and don't brick the entire app
      console.error(e);
    }
  });

  return result;
}

/**
 * @param data api response from merkle's notification api endpint
 * @returns array of casts, ready to be displayed
 */
function processMerkleNotification(data: MerkleNotification[], recaster?: string): CastInterface[] {
  let result: CastInterface[] = [];
  data.forEach((cast: MerkleNotification) => {
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

      result.push({
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
      });


    } catch (e) {
      // if type wrong, don't push the cast, and don't brick the entire app
      console.error(e);
    }
  });

  return result;
}

/**
 * @param data api response from searchcaster endpoint
 * @returns array of casts, ready to be displayed
 */
function processSearchcasterCasts(data: SearchcasterApiResponse): CastInterface[] {
  let result: CastInterface[] = [];

  data.casts.forEach((cast: SearchcasterCast) => {
    try {
      let parent;
      if (typeof cast.body.data.replyParentMerkleRoot === "string" && typeof cast.meta.replyParentUsername.username === "string") {
        parent = {
          hash: cast.body.data.replyParentMerkleRoot,
          username: cast.meta.replyParentUsername.username,
        };
      }

      // recasted is always undefined
      let recasted;

      result.push({
        author: {
          username: cast.body.username,
          pfp: cast.meta.avatar,
          displayName: cast.meta.displayName,
        },
        parent,
        recasted,
        text: linkify(cast.body.data.text),
        image: cast.body.data.image,
        timestamp: cast.body.publishedAt,
        likes: cast.meta.reactions.count,
        recasts: cast.meta.recasts.count,
        replies: cast.meta.numReplyChildren,
        hash: cast.merkleRoot,
      });

    } catch (e) {
      // if type wrong, don't push the cast, and don't brick the entire app
      console.error(e);
    }
  });

  return result;
}

/**
 * @param data api response from merkle's api endpint
 * @returns array of casts, ready to be displayed
 */
function processPerlCasts(data: PerlApiResponse): CastInterface[] {
  let result: CastInterface[] = [];
  data.forEach((cast: PerlCast) => {
    try {
      let image;
      if (cast.payload.attachments && cast.payload.attachments.openGraph.length > 0) {
        // if there's image attached to cast
        image = getImageLink(cast.payload.attachments.openGraph[0]);
      }

      result.push({
        author: {
          username: cast.payload.body.username,
          displayName: cast.payload.meta.displayName,
          pfp: cast.payload.meta.avatar,
          fid: cast.payload.body.fid
        },
        parent: undefined,
        recasted: undefined,
        hash: cast.payload.merkleRoot,
        text: linkify(cast.payload.body.data.text),
        image,
        timestamp: cast.payload.body.publishedAt,
        likes: cast.payload.meta.reactions.count,
        recasts: cast.payload.meta.recasts.count,
        replies: cast.payload.meta.numReplyChildren,
      });


    } catch (e) {
      // if type wrong, don't push the cast, and don't brick the entire app
      console.error(e);
    }
  });

  return result;
}

/**
 * todo
 * 
 * @param data 
 * @param type 
 * @param recaster 
 * @returns 
 */
export function processCasts(data: any, type: string, recaster?: string): CastInterface[] {

  if (type == 'merkle') {
    return processMerkleCasts(data, recaster);
  } else if (type == 'merkleNotification') {
    return processMerkleNotification(data, recaster);
  } else if (type == 'searchcaster') {
    return processSearchcasterCasts(data);
  } else if (type == 'perl') {
    return processPerlCasts(data);
  }

  // todo: handle error
}

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

/**
 * filter out duplicate casts, then sort ascending by timestamp
 */
function filterAndSortCasts(casts: CastInterface[]): CastInterface[] {
  return orderBy(casts.filter((obj, index, arr) => {
    return arr.map((mapObj) => mapObj.hash).indexOf(obj.hash) === index;
  }), 'timestamp', 'desc');
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
  let hubKey = import.meta.env.VITE_HUB_KEY;
  if (userHubKey) hubKey = userHubKey;

  await Promise.all(
    endpoints.map(async endpoint => {
      try {
        let finalUrl = endpoint.url;
        if (endpoint.type == 'searchcaster' && endpoint.nextPage) {
          finalUrl = finalUrl + `&page=${endpoint.nextPage}`;
          const response = await fetch(finalUrl);
          const data: SearchcasterApiResponse = await response.json();

          // update nextPage
          const nextPage = endpoint.nextPage;
          let newEndpoint = endpoint;
          newEndpoint.nextPage = nextPage + 1;
          endpointWithNext.push(newEndpoint);

          // append the casts
          casts = [...casts, ...processCasts(data, 'searchcaster')];

        }
        else if (endpoint.type == 'merkle') {
          if (endpoint.cursor) finalUrl = finalUrl + `&cursor=${endpoint.cursor}`;
          const response = await fetch(finalUrl, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${hubKey}`
            },
          });

          let data: MerkleApiResponse = await response.json();

          // update cursor
          try {
            let newEndpoint = endpoint;
            const nextCursor = data.next.cursor;
            if (nextCursor) newEndpoint.cursor = data.next.cursor;
            endpointWithNext.push(newEndpoint);
          } catch {
            // cursor doesn't exist
            // it means user hasn't posted much
            console.log('cursor does not exist');
            endpointWithNext.push(endpoint);
          }

          casts = [...casts, ...processCasts(data, 'merkle', endpoint.username)];
        }

        else if (endpoint.type == 'merkleNotification') {
          if (endpoint.cursor) finalUrl = finalUrl + `&cursor=${endpoint.cursor}`;
          const response = await fetch(finalUrl, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${hubKey}`
            },
          });

          let data: MerkleNotificationApiResponse = await response.json();
          let rawCasts: MerkleNotification[] = [];
          if ("notifications" in data.result) {
            const notifications = data.result.notifications;
            for (const key in notifications) {
              if (notifications[key].type == 'cast-reply' || notifications[key].type == 'cast-mention') {
                rawCasts.push(notifications[key].content.cast);
              }
            }
          }

          // update cursor
          try {
            let newEndpoint = endpoint;
            const nextCursor = data.next.cursor;
            if (nextCursor) newEndpoint.cursor = data.next.cursor;
            endpointWithNext.push(newEndpoint);
          } catch {
            // cursor doesn't exist
            // it means user hasn't posted much
            console.log('cursor does not exist');
            endpointWithNext.push(endpoint);
          }

          casts = [...casts, ...processCasts(rawCasts, 'merkleNotification', endpoint.username)];
        }

        /**
         * it works somewhat but still buggy as hell
         */
        // else if (endpoint.type == 'perl' && endpoint.nextPage) {
        //   if (endpoint.nextPage > 0) finalUrl = finalUrl + `&page=${endpoint.nextPage}`;

        //   const response = await fetch(finalUrl);
        //   const data: PerlApiResponse = await response.json();

        //   // update nextPage
        //   const nextPage = endpoint.nextPage;
        //   let newEndpoint = endpoint;
        //   newEndpoint.nextPage = nextPage + 1;
        //   endpointWithNext.push(newEndpoint);

        //   // append the casts
        //   casts = [...casts, ...processCasts(data, 'perl')];
        // }

      } catch (e) {
        console.error(e);
      }
    })
  );

  return { casts: filterAndSortCasts(casts), endpoints: endpointWithNext };
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