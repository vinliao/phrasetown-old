<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';

	new Promise((r) => setTimeout(r, 2000)).then(() => {
		goto('/');
	});
</script>

<div in:fade={{ duration: 200 }}>
	<PageHeader name="Welcome!" />
	<div class="p-4 flex flex-col space-y-2">
		<p class="font-[900]">Connection successful. Welcome to Phrasetown!</p>

		<p>You will be redirected to the home page shortly.</p>

		<p>🟪⛩️</p>
	</div>
</div>
