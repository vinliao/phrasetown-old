<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { fade } from 'svelte/transition';
</script>

<div in:fade={{ duration: 200 }}>
	<PageHeader name="About" />
	<div class="p-4 flex flex-col space-y-2">
		<p>GM.</p>

		<p>
			Phrasetown is a Farcaster client in the browser. This is perfect for people who love
			Farcaster, who prefers desktop over mobile, but aren&#39;t in the Apple Ecosystem.
		</p>

		<p>It's open-source: link</p>

		<p>
			Complaints, comments, feature requests? Ping me on Farcaster @pixel or email me
			vincent@pixelhack.xyz. Bug report? Please file a GitHub Issue.
		</p>

    <p>🟪⛩️</p>
	</div>
</div>
