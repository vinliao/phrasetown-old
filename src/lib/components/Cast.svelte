<script lang="ts">
	// subcomponents
	import type { CastInterface } from '$lib/types';
	import { fade } from 'svelte/transition';
	import ReplyTextbox from '$lib/components/ReplyTextbox.svelte';

	let replyInput = '';

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
	let isSending = false;

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
			<span class="text-neutral-400">· {time}</span>
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
			</div>
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
