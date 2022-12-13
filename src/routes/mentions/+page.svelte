<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import type { CastInterface, EndpointInterface } from '$lib/types';
	import Cast from '$lib/components/Cast.svelte';
	import { fade } from 'svelte/transition';
	import { userHubKeyWritable } from '$lib/stores';

	let casts: CastInterface[] = [];
	let endpoints: EndpointInterface[] = [];

	$: if ($userHubKeyWritable) {
		(async () => {
			const response = await fetch(`/api/fetch-mentions`, {
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

<div>
	<PageHeader name="Mentions" />
	{#if casts.length > 0}
		<div in:fade={{ duration: 200 }}>
			{#each casts as cast}
				<Cast {cast} />
			{/each}
		</div>
	{:else}
		<div class="flex justify-center py-5">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6 animate-spin"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
			</svg>
		</div>
	{/if}
</div>
