<script lang="ts">
	import type { CastInterface } from '$lib/types';
	import ReplyTextbox from '$lib/components/ReplyTextbox.svelte';
	import ReplyRecastLike from '$lib/components/ReplyRecastLike.svelte';
	export let cast: CastInterface;

	// timestamp related
	// todo: move this to backend
	import * as timeago from 'timeago.js';
	function enShort(number: number, index: number): [string, string] {
		return [
			['just now', 'right now'],
			['%ss ago', 'in %ss'],
			['1m ago', 'in 1m'],
			['%sm ago', 'in %sm'],
			['1h ago', 'in 1h'],
			['%sh ago', 'in %sh'],
			['1d ago', 'in 1d'],
			['%sd ago', 'in %sd'],
			['1w ago', 'in 1w'],
			['%sw ago', 'in %sw'],
			['1mo ago', 'in 1mo'],
			['%smo ago', 'in %smo'],
			['1yr ago', 'in 1yr'],
			['%syr ago', 'in %syr']
		][index] as [string, string];
	}
	timeago.register('en-short', enShort);
	const time = timeago.format(cast.timestamp, 'en-short').replace(' ago', '');

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
</script>

<div class="relative px-4 pb-4 bg-neutral-900">
	<div class={pfpLineUpClass} />
</div>
<div class="bg-neutral-900 p-4 pt-0 flex flex-col min-w-0 relative">
	<div class="flex items-center mb-3 space-x-4">
		<div class="h-12 w-12 flex-none {pfpLineDownClass}">
			<a href={`/@${cast.author.username}`}>
				<img
					src={cast.author.pfp}
					alt=""
					class="object-cover w-full h-full rounded-2xl z-10 relative"
				/>
			</a>
		</div>
		<div class="flex flex-col">
			<a class="font-bold hover:underline" href={`/@${cast.author.username}`}
				>{cast.author.displayName}</a
			>
			<a class="hover:underline text-neutral-400" href={`/@${cast.author.username}`}
				>@{cast.author.username}</a
			>
		</div>
	</div>

	<div class="min-w-0 w-full">
		<p class="mb-3 whitespace-pre-wrap break-words text-lg">{@html cast.text}</p>

		{#if cast.image}
			<div>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<a href={cast.image} target="_blank" rel="noreferrer">
					<img class="rounded-2xl mb-3 object-cover h-48 w-full" src={cast.image} alt="" />
				</a>
			</div>
		{/if}

		<ReplyRecastLike {cast} {toggleReplyTextbox} {time} />
	</div>
</div>

{#if replyTextbox}
	<ReplyTextbox {cast} {toggleReplyTextbox} />
{/if}

<div class="h-2 w-full bg-[#0a0a0a]" />
