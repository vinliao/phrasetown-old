<script lang="ts">
	import type { CastInterface } from '$lib/types';
	import ReplyTextbox from '$lib/components/ReplyTextbox.svelte';
	import ReplyRecastLike from '$lib/components/ReplyRecastLike.svelte';
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

	export let theCast = false;
	$: theCastClass = theCast ? `text-lg bg-[#212121]` : '';
</script>

<a href={`/cast/${cast.hash}`}>
	<!-- needs documentation on how this works -->
	{#if cast.recasted}
		<div class="flex items-center py-2 text-neutral-500 px-4 space-x-2">
			<!-- 14 here is 12 (width of pfp) + space-x-2 -->
			<div class="w-14 flex justify-end">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
					/>
				</svg>
			</div>
			<p>
				<a class="text-neutral-500 font-semibold" href={`/@${cast.recasted.username}`}>
					@{cast.recasted?.username}</a
				> recasted
			</p>
		</div>
	{:else}
		<div class="relative px-4 pb-2 bg-neutral-900 {theCastClass}">
			<div class={pfpLineUpClass} />
		</div>
	{/if}
	<div class="bg-neutral-900 p-4 pb-2 pt-0 flex space-x-4 min-w-0 relative {theCastClass}">
		<div class="h-12 w-12 flex-none {pfpLineDownClass}">
			<a href={`/@${cast.author.username}`}>
				<img
					src={cast.author.pfp}
					alt=""
					class="object-cover w-full h-full rounded-2xl z-10 relative"
				/>
			</a>
		</div>

		<div class="min-w-0 w-full">
			<a class="font-bold hover:underline" href={`/@${cast.author.username}`}
				>{cast.author.displayName}</a
			>
			<a class="hover:underline text-neutral-400" href={`/@${cast.author.username}`}
				>@{cast.author.username}</a
			>
			<span class="text-neutral-400">· {cast.timestamp}</span>
			{#if cast.parent}
				<p class="text-neutral-400">
					Replying to <a href={`/@${cast.parent.username}`}>@{cast.parent.username}</a>
				</p>
			{/if}
			<p class="mb-3 whitespace-pre-wrap break-words">{@html cast.text}</p>

			{#if cast.image}
				<div>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<a href={cast.image} target="_blank" rel="noreferrer">
						<img class="rounded-2xl mb-3 object-cover h-48 w-full" src={cast.image} alt="" />
					</a>
				</div>
			{/if}

			<ReplyRecastLike {cast} {toggleReplyTextbox} />
		</div>
	</div>
</a>

{#if replyTextbox}
	<ReplyTextbox {cast} {toggleReplyTextbox} />
{/if}

<!-- todo: figure out a better way to do this -->
{#if theCast}
	<div class="h-2 w-full bg-[#0a0a0a]" />
{:else if !pfpLineDown}
	<div class="h-0.5 w-full bg-[#0a0a0a]" />
{/if}
