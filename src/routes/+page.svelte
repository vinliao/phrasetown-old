<script lang="ts">
	import { showNoticeError } from '$lib/stores';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import type { CastInterface, EndpointMetadataInterface } from '$lib/types';
	import Cast from '$lib/components/Cast.svelte';
	import { fade } from 'svelte/transition';
	import { fetchMore } from '$lib/utils';
	import IntersectionObserver from 'svelte-intersection-observer';

	export let data: { casts: CastInterface[]; endpoints: EndpointMetadataInterface[] };
	let casts = data.casts;
	let endpoints = data.endpoints;

	let fetchLoading = false;
	async function localFetchMore() {
		// only fetch if it's not fetching
		if (!fetchLoading) {
			fetchLoading = true;

			const data = await fetchMore(casts, endpoints);
			if (data) {
				casts = data.casts;
				endpoints = data.endpoints;
			} else {
				console.log('something wrong with fetching data');
				showNoticeError.set('Error when fetching data, try refreshing?');
			}

			fetchLoading = false;
		}
	}

	let element: any;
</script>

<IntersectionObserver
	once
	{element}
	on:intersect={(_) => {
		localFetchMore();
	}}
>
	<div in:fade={{ duration: 200 }}>
		<PageHeader name="Home" />
		{#each casts as cast, index}
			{#if index == Math.floor(casts.length * 0.7)}
				<div bind:this={element}>
					<Cast {cast} />
				</div>
			{:else}
				<Cast {cast} />
			{/if}
		{/each}
	</div>
</IntersectionObserver>
