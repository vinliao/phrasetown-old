<script lang="ts">
	import { showNoticeError } from '$lib/stores';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import type { CastInterface, EndpointInterface } from '$lib/types';
	import Cast from '$lib/components/Cast.svelte';
	import { fade } from 'svelte/transition';
	import { fetchMore, getEndpointsWithout, idOf, removeDuplicate } from '$lib/utils';
	import IntersectionObserver from 'svelte-intersection-observer';
	import { shuffle } from 'lodash-es';

	export let data: { casts: CastInterface[]; endpoints: EndpointInterface[] };
	let casts = data.casts;
	// let endpoints = data.endpoints;

	let endpoints = getEndpointsWithout([idOf('New'), idOf('Mentions')]);

  /**
   * when fetchMore is called, it takes random endpoints, gets the casts
   * and updates the endpoints' cursors
   * 
   * the basic idea: eliminate /feeds, enable users to scroll the home page
   * without having to navigate to /feeds (which sucks)
   */
	let fetchLoading = false;
	async function localFetchMore() {
		// only fetch if it's not fetching
		if (!fetchLoading) {
			fetchLoading = true;
			const randomEndpoints = getRandomEndpoints(5);
			const data = await fetchMore(casts, randomEndpoints);
			if (data) {
				casts = removeDuplicate([...casts, ...shuffle(data.casts)]);
				endpoints = [
					...endpoints.filter((endpoint) => !randomEndpoints.includes(endpoint)),
					...data.endpoints
				];
			} else {
				console.log('something wrong with fetching data');
				showNoticeError.set('Error when fetching data, try refreshing?');
			}

			fetchLoading = false;
		}
	}

	function getRandomEndpoints(count: number) {
		return shuffle(endpoints).slice(0, count);
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
