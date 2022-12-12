<script lang="ts">
	import type { CastInterface } from '$lib/types';
	import { showNotice, showNoticeError, userHubKeyWritable } from '$lib/stores';
	import { fade } from 'svelte/transition';

	export let cast: CastInterface;
	export let time: string | undefined = undefined;
	export let toggleReplyTextbox = () => {};

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
</script>

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
	{#if time}
		<div class="flex-1" />
		<span class="text-neutral-400">{time}</span>
	{/if}
</div>
