<script lang="ts">
	import { showNotice, userHubKeyWritable } from '$lib/stores';
	import { fly } from 'svelte/transition';
	export let hash: string;
	export let padRight = false;
	export let isSelf: boolean;
	export let toggleOptionModal = () => {};

	/**
	 * todo: this component can be made of multiple components
	 * each has its own callback (what to do on click)
	 *
	 * imagine implementing a hundred of these buttons, wouldn't it
	 * make more sense to have a single function that generates those
	 * components rather than implementing it individually?
	 */

	$: padRightClass = padRight ? 'right-4' : 'right-0';

	let linkCopied = false;
	$: linkCopiedClass = linkCopied ? 'visible' : 'invisible';

	let bookmark = false;
	$: bookmarkClass = bookmark ? 'visible' : 'invisible';
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="absolute z-10 {padRightClass} top-6 flex flex-col bg-neutral-800 p-4 space-y-2 rounded-2xl text-neutral-400"
	transition:fly={{ y: -10, duration: 150 }}
	on:click|preventDefault
>
	<button
		class="flex space-x-2 items-center"
		on:click|preventDefault={async () => {
			navigator.clipboard.writeText(`https://phrasetown.com/cast/${hash}`);
			linkCopied = true;
			await new Promise((r) => setTimeout(r, 1000));
			linkCopied = false;
			toggleOptionModal();
		}}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			class="w-5 h-5 {linkCopiedClass} text-green-400"
		>
			<path
				fill-rule="evenodd"
				d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
				clip-rule="evenodd"
			/>
		</svg>
		<span class="hover:text-neutral-200 transition">Copy link</span>
	</button>

	{#if isSelf}
		<button
			class="flex space-x-2 items-center"
			on:click|preventDefault={async () => {
				toggleOptionModal();
				const response = await fetch('/api/delete-cast', {
					method: 'DELETE',
					body: JSON.stringify({
						castHash: hash,
						userHubKey: $userHubKeyWritable
					})
				});

				if (response.ok) showNotice.set('Cast deleted successfully!');
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-5 h-5 {bookmarkClass} text-green-400"
			>
				<path
					fill-rule="evenodd"
					d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
					clip-rule="evenodd"
				/>
			</svg>
			<span class="hover:text-neutral-200 transition">Delete cast</span>
		</button>
	{/if}
</div>
