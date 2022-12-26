<script lang="ts">
	import type { CastInterface } from '$lib/types';
	import ReplyTextbox from '$lib/components/ReplyTextbox.svelte';
	import ReplyRecastLike from '$lib/components/ReplyRecastLike.svelte';
	import { getTimeago } from '$lib/utils';
	import { fade } from 'svelte/transition';
	import CastOptionModal from '$lib/components/CastOptionModal.svelte';
	export let cast: CastInterface;

	// texbox reply
	let replyTextbox = false;
	function toggleReplyTextbox() {
		replyTextbox = !replyTextbox;
	}

	export let pfpLineDown = false;
	export let pfpLineUp = false;
	// export let ancestor = false;
	$: pfpLineDownClass = pfpLineDown
		? `before:h-full before:border-l-2 before:border-neutral-700 before:absolute before:ml-6`
		: '';
	$: pfpLineUpClass = pfpLineUp
		? `before:h-full before:border-l-2 before:border-neutral-700 before:absolute before:ml-6`
		: '';

	import IntersectionObserver from 'svelte-intersection-observer';
	import { fidWritable } from '$lib/stores';
	let element: any;
	let intersecting: any;

	let optionModal = false;
	function toggleOptionModal() {
		optionModal = !optionModal;
	}
</script>

<div class="relative px-4 pb-4 bg-neutral-900">
	<div class={pfpLineUpClass} />
</div>
<IntersectionObserver bind:intersecting {element} once>
	<div class="bg-neutral-900 p-4 pt-0 flex flex-col min-w-0 relative" bind:this={element}>
		<!-- has to be padded right because it's relative the entire cast 
      while in the Cast.svelte, it's relative to the pfp element,
      which is padded -->

		{#if optionModal}
			<CastOptionModal
				hash={cast.hash}
				{toggleOptionModal}
				padRight
				isSelf={cast.author.fid == $fidWritable}
			/>
		{/if}

		<div class="flex items-center mb-3 space-x-4">
			<div class="h-12 w-12 flex-none {pfpLineDownClass}">
				{#if intersecting}
					<a href={`/@${cast.author.username}`}>
						<img
							src={cast.author.pfp}
							alt=""
							class="object-cover w-full h-full rounded-2xl z-10 relative"
							in:fade={{ duration: 200 }}
						/>
					</a>
				{:else}
					<div class="h-full w-full rounded-2xl bg-neutral-600 animate-pulse" />
				{/if}
			</div>
			<div class="flex flex-col">
				<a class="font-bold hover:underline" href={`/@${cast.author.username}`}
					>{cast.author.displayName}</a
				>
				<a class="hover:underline text-neutral-400" href={`/@${cast.author.username}`}
					>@{cast.author.username}</a
				>
			</div>
			<div class="flex-1" />
			<button on:click|preventDefault={toggleOptionModal} class="self-start">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="w-5 h-5  text-neutral-500 hover:text-neutral-200 transition"
				>
					<path
						d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
					/>
				</svg>
			</button>
		</div>

		<div class="min-w-0 w-full">
			<p class="mb-3 whitespace-pre-wrap break-words text-lg">{@html cast.text}</p>

			{#if cast.image}
				<div>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<a href={cast.image} target="_blank" rel="noreferrer">
						{#if intersecting}
							<img class="rounded-2xl mb-3 object-cover h-48 w-full" src={cast.image} alt="" />
						{:else}
							<div class="mb-3 w-full h-48 rounded-2xl bg-neutral-600 animate-pulse" />
						{/if}
					</a>
				</div>
			{/if}

			<ReplyRecastLike {cast} {toggleReplyTextbox} time={getTimeago(cast.timestamp)} />
		</div>
	</div>
</IntersectionObserver>

{#if replyTextbox}
	<ReplyTextbox {cast} {toggleReplyTextbox} />
{/if}

<div class="h-2 w-full bg-[#0a0a0a]" />
