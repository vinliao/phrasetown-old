<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import type { CastInterface, EndpointInterface } from '$lib/types';
	import Cast from '$lib/components/Cast.svelte';
	import { fade } from 'svelte/transition';
	import { userHubKeyWritable } from '$lib/stores';

	let casts: CastInterface[] = [];
	let endpoints: EndpointInterface[] = [];
  
  /**
   * bug: only this page errors out when trying to fetch from backend
   * this is just a temporary, ugly workaround
  */
	$: if ($userHubKeyWritable) {
		(async () => {
			const url = import.meta.env.PROD ? 'https://phrasetown.com' : 'http://localhost:5173';
			const response = await fetch(`${url}/api/fetch-mentions`, {
				method: 'PUT',
				body: JSON.stringify({
					userHubKey: $userHubKeyWritable
				})
			});
			const data = await response.json();
			casts = data.casts;
			endpoints = data.endpoints;
		})();
	}
</script>

<div in:fade={{ duration: 200 }}>
	<PageHeader name="Mentions" />
	{#each casts as cast}
		<Cast {cast} />
	{/each}
</div>
