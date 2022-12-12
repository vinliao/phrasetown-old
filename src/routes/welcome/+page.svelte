<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';

	new Promise((r) => setTimeout(r, 5000)).then(() => {
		goto('/');
	});
</script>

<div in:fade={{ duration: 200 }}>
	<PageHeader name="About" />
	<div class="p-4 flex flex-col space-y-2">
		<p class="font-[900]">Your wallet has been successfully connected. Welcome to Phrasetown!</p>

		<p>
			Complaints, comments, feature requests? Ping me on Farcaster @pixel or email me
			vincent@pixelhack.xyz.
		</p>

		<p>You will be redirected to the home page shortly.</p>
	</div>
</div>
