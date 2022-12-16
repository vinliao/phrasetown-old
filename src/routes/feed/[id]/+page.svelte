<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import type { CastInterface, EndpointInterface } from '$lib/types';
	import Cast from '$lib/components/Cast.svelte';
	import { fade } from 'svelte/transition';
	import { fetchMore } from '$lib/utils';
	import { showNoticeError } from '$lib/stores';
	import IntersectionObserver from 'svelte-intersection-observer';

	export let data: { casts: CastInterface[]; endpoints: EndpointInterface[] };
	$: casts = data.casts;
	$: endpoints = data.endpoints;
	$: name = data.endpoints[0].name;

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
		<PageHeader {name} />
		{#each casts as cast, index}
			{#if index == casts.length - 10}
				<div bind:this={element}>
					<Cast {cast} />
				</div>
			{:else}
				<Cast {cast} />
			{/if}
		{/each}
	</div>
</IntersectionObserver>
