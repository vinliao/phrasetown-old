<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { fade } from 'svelte/transition';
	import { getFeedEndpoints } from '$lib/utils';
	import { groupBy } from 'lodash-es';

	const allFeedEndpoints = getFeedEndpoints();
	const groupedEndpoints = groupBy(allFeedEndpoints, 'id');
</script>

<div class="bg-neutral-900" in:fade={{ duration: 200 }}>
	<PageHeader name="Feeds" />
	<div class="p-4 flex flex-col space-y-2">
		<p class="font-[900]">Curated feeds</p>
		<span>
			I have curated some of the most interesting people in Farcaster, and turned their casts into
			feeds. Here are some of them.
		</span>
		<ul class="list-disc list-inside text-neutral-500">
			{#each Object.entries(groupedEndpoints) as [key, value], index (key)}
				<li>
					<span class="text-neutral-500 hover:text-neutral-200 transition font-bold text-lg">
						<a href={`/feed/${key}`}>{groupedEndpoints[key][0].name}</a>
					</span>
				</li>
			{/each}
		</ul>
	</div>
</div>
