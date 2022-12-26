<script lang="ts">
	import Cast from '$lib/components/Cast.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';

	export let data;
	$: casts = data.casts;
</script>

<PageHeader name="Search" />
{#each casts as cast}
	<Cast {cast} />
{/each}
