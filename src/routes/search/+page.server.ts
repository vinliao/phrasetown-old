import { transformCasts } from '$lib/utils';
import type { PageServerLoad } from './$types';

// todo: documentation

async function getEmbeddings(texts: string[]): Promise<number[][]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_KEY}`
    },
    body: JSON.stringify({
      input: texts,
      model: 'text-embedding-ada-002'
    })
  });
  const data = await response.json();
  return data.data.map(embeddingData => embeddingData.embedding);
}

async function queryPinecone(vector: number[]) {
  const response = await fetch(`https://phrasetown-cast-d9c061d.svc.us-west1-gcp.pinecone.io/query `, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': import.meta.env.VITE_PINECONE_KEY
    },
    body: JSON.stringify({
      vector,
      topK: 10,
      includeMetadata: false,
      includeValues: false,
      namespace: ''
    })
  });

  const data = await response.json();
  return data.matches.map(embedding => embedding.id);
}

async function getCasts(hashes: string[]) {
  const casts = Promise.all(hashes.map(async hash => {
    const response = await fetch(`https://api.farcaster.xyz/v2/cast?hash=${hash}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_HUB_KEY}`
        },
      }
    );

    // sometimes cast doesn't exist
    const data = await response.json();
    if ('result' in data) {
      return data.result.cast;
    }
  }));

  return (await casts).filter(cast => cast != undefined);
}

// end goal: return casts
export const load: PageServerLoad = async ({ url }) => {
  const query = url.searchParams.get('q');
  if (!query) return { casts: [] };
  /**
   * getEmbeddings return number[][] of index 1 (only one query)
   * flatten so it can be inserted into queryPinecone
   */
  const searchHashes = await queryPinecone((await getEmbeddings([query])).flat(1));
  return {
    casts: transformCasts(await getCasts(searchHashes), 'merkleUser')
  };
};