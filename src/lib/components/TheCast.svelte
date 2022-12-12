<script lang="ts">
	// subcomponents
	import type { CastInterface } from '$lib/types';
	import { fade } from 'svelte/transition';
	import ReplyTextbox from '$lib/components/ReplyTextbox.svelte';

	// props
	export let cast: CastInterface;
	import { showNotice, showNoticeError, userHubKeyWritable } from '$lib/stores';

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

	let recastPulse = false;
	async function recast() {
		cast.recasts++;
		recastPulse = true;

		const response = await fetch(`/api/recast-cast`, {
			method: 'PUT',
			body: JSON.stringify({
				castHash: cast.hash,
				userHubKey: $userHubKeyWritable
			})
		});

		if (response.ok) showNotice.set('Recast successful!');
		else {
			if (!$userHubKeyWritable) {
				showNoticeError.set('Error: wallet not connected!');
			} else {
				showNoticeError.set('Oops, recast failed. Try again?');
			}
			cast.recasts--;
		}

		await new Promise((r) => setTimeout(r, 2000));
		recastPulse = false;
	}

	let likePulse = false;
	async function like() {
		cast.likes++;
		likePulse = true;

		const response = await fetch(`/api/like-cast`, {
			method: 'PUT',
			body: JSON.stringify({
				castHash: cast.hash,
				userHubKey: $userHubKeyWritable
			})
		});

		if (!response.ok) {
			if (!$userHubKeyWritable) {
				showNoticeError.set('Error: wallet not connected!');
			} else {
				showNoticeError.set('Oops, recast failed. Try again?');
			}
			cast.likes--;
		}

		await new Promise((r) => setTimeout(r, 2000));
		likePulse = false;
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

		<div class="space-x-6 flex">
			<button
				class="hover:text-neutral-300 transition text-neutral-400 focus:outline-none"
				on:click|preventDefault={toggleReplyTextbox}
			>
				<span class="font-bold">{cast.replies}</span> <span>replies</span>
			</button>

			{#if !recastPulse}
				<button
					class="hover:text-neutral-300 transition text-neutral-400 focus:outline-none"
					on:click|preventDefault={recast}
				>
					<span class="font-bold">{cast.recasts}</span> <span>recasts</span>
				</button>
			{:else}
				<div class="text-green-400" in:fade={{ duration: 200 }}>
					<span class="font-bold">{cast.recasts}</span>
					<span>recasts</span>
				</div>
			{/if}

			{#if !likePulse}
				<button
					class="hover:text-neutral-300 transition text-neutral-400 focus:outline-none"
					on:click|preventDefault={like}
				>
					<span class="font-bold">{cast.likes}</span> <span>likes</span>
				</button>
			{:else}
				<div class="text-red-400" in:fade={{ duration: 200 }}>
					<span class="font-bold">{cast.likes}</span>
					<span>likes</span>
				</div>
			{/if}
			<div class="flex-1" />
			<span class="text-neutral-400">{time}</span>
		</div>
	</div>
</div>

{#if replyTextbox}
	<ReplyTextbox {cast} {toggleReplyTextbox} />
{/if}

<div class="h-2 w-full bg-[#0a0a0a]" />
