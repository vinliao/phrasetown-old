<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import type { CastInterface, EndpointMetadataInterface } from '$lib/types';
	import Cast from '$lib/components/Cast.svelte';
	import { fade } from 'svelte/transition';
	import { fidWritable, userHubKeyWritable, usernameWritable } from '$lib/stores';

	let casts: CastInterface[] = [];
	let endpoints: EndpointMetadataInterface[] = [];
	$: if ($fidWritable && $usernameWritable && $userHubKeyWritable) {
		(async () => {
			const response = await fetch('http://localhost:5173/api/fetch-mentions', {
				method: 'PUT',
				body: JSON.stringify({
					fid: $fidWritable,
					username: $usernameWritable,
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
