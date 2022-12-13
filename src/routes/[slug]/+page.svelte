<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { CastInterface } from '$lib/types';
	import Cast from '$lib/components/Cast.svelte';
	import type { User } from '$lib/types/merkleUserByUsername';
	import { linkify } from '$lib/utils';

	export let data: { user: User; topLevelCasts: CastInterface[]; replyCasts: CastInterface[] };
	const { user, topLevelCasts, replyCasts } = data;

	let currentDisplayIndex = 0;

	function displayWithReply() {
		currentDisplayIndex = 1;
	}

	function displayTopLevelCasts() {
		currentDisplayIndex = 0;
	}
</script>

<div in:fade={{ duration: 100 }} class="bg-neutral-900 text-neutral-200 flex flex-col">
	<div class="p-4 break-words" in:fade={{ duration: 200 }}>
		<div class="flex mb-3">
			<div class="flex-1" />
			<img class="h-32 w-32 rounded-[2rem]" src={user.pfp.url} alt="" />
			<div class="flex-1" />
		</div>
		<div class="flex space-x-2 text-lg mb-1 items-center">
			<span class="font-bold truncate">{user.displayName}</span>
			<span>@{user.username}</span>
		</div>
		<div class="mb-10 flex flex-col">
			{#if user.profile.bio.text != ''}
				<p>{@html linkify(user.profile.bio.text)}</p>
			{/if}
		</div>

		<div class="flex space-x-2 hover:cursor-pointer">
			{#if currentDisplayIndex == 0}
				<span>Casts</span>
				<span class="text-neutral-500">·</span>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<span class="text-neutral-500" on:click={displayWithReply}>Reply casts</span>
			{:else if currentDisplayIndex == 1}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<span class="text-neutral-500" on:click={displayTopLevelCasts}>Casts</span>
				<span class="text-neutral-500">·</span>
				<span>Reply casts</span>
			{/if}
		</div>
	</div>

	<!-- if is profile, make it sit on top of the thing (just normal absolute) -->
	<!-- // make another unique column? -->
	{#if currentDisplayIndex == 0}
		<div in:fade={{ duration: 200 }}>
			{#each topLevelCasts as cast}
				<Cast {cast} />
			{/each}
		</div>
	{:else if currentDisplayIndex == 1}
		<div in:fade={{ duration: 200 }}>
			{#each replyCasts as cast}
				<Cast {cast} />
			{/each}
		</div>
	{/if}
</div>
