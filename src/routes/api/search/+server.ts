import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '../../../../.svelte-kit/types/src/routes/api/search/$types';

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

export const GET: RequestHandler = async ({ url }) => {
  const query = url.searchParams.get('q');
  if (query) {
    return json({ data: await queryPinecone((await getEmbeddings([query])).flat(1)) });
  }
  return error(500, 'params ?q= must exist');
};