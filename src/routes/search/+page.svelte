<script lang="ts">
	import Cast from '$lib/components/Cast.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SearchPage from '$lib/components/SearchPage.svelte';

	export let data;
	console.log(data);
	$: casts = data.casts;
</script>

{#if casts.length == 0}
	<SearchPage />
{:else}
	<PageHeader name="Search" />
	{#each casts as cast}
		<Cast {cast} />
	{/each}
{/if}
