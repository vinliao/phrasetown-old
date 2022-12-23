<script lang="ts">
	import { showNoticeError, userHubKeyWritable } from '$lib/stores';
	import autosize from 'autosize';
	import { fly, fade } from 'svelte/transition';
	import {
		showNotice,
		usernameWritable,
		fidWritable,
		programmaticallyRefreshColumn
	} from '$lib/stores';

	let castInput: string;
	let isSending = false;
	let newCastTextbox = false;
	$: castButtonDim = newCastTextbox
		? 'bg-neutral-900 text-neutral-50'
		: 'bg-neutral-50 text-neutral-900';

	function toggleNewCastTextbox() {
		newCastTextbox = !newCastTextbox;
	}

	async function cast() {
		isSending = true;
		const response = await fetch('/api/cast', {
			method: 'POST',
			body: JSON.stringify({ castText: castInput, userHubKey: $userHubKeyWritable })
		});

		if (response.ok) {
			showNotice.set('Cast sent successfully!');
			toggleNewCastTextbox();
			castInput = '';
			isSending = false;

			programmaticallyRefreshColumn.set(true);
		} else {
			showNoticeError.set('Oops, something is wrong... Try again?');
			isSending = false;
		}
	}
</script>

<div class="text-neutral-200 flex flex-col p-3 space-y-4 items-end text-lg font-mono fixed">
	<a href="/" class="font-black text-3xl text-white tracking-tight font-sans hover:no-underline"
		>Phrasetown</a
	>
	<a href="/about" class=" text-neutral-500 hover:text-neutral-200 transition ">About</a>
	<a href="/feed" class=" text-neutral-500 hover:text-neutral-200 transition ">Feed</a>
	<a href="/feed/GK-rQ3w0s41xcTeRwVXgw" class=" text-neutral-500 hover:text-neutral-200 transition ">New</a>

	{#if $userHubKeyWritable}
		<a href={`/@${$usernameWritable}`} class=" text-neutral-500 hover:text-neutral-200 transition "
			>@{$usernameWritable}</a
		>
		<button
			class="focus:outline-none px-3 py-2 {castButtonDim} border border-neutral-50 transition rounded-lg flex items-center space-x-2"
			in:fade={{ duration: 200 }}
			on:click={toggleNewCastTextbox}
		>
			<span> New Cast </span>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
			</svg>
		</button>
	{:else}
		<a
			href="https://connect.phrasetown.com"
			class=" text-neutral-500 hover:text-neutral-200 transition ">Connect</a
		>
		<div
			class="focus:outline-none px-3 py-2 bg-neutral-900 text-neutral-400 border border-neutral-400 rounded-lg flex items-center space-x-2 hover:cursor-not-allowed"
		>
			<span> New Cast </span>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
			</svg>
		</div>
	{/if}

	{#if newCastTextbox}
		<div
			class="bg-neutral-800 rounded-lg w-full px-3 py-2"
			transition:fly={{ y: -25, duration: 200 }}
		>
			<textarea
				bind:value={castInput}
				use:autosize
				autofocus
				rows="3"
				placeholder="It is time to farcast."
				class="mb-1 w-full bg-neutral-800 focus:outline-none text-lg placeholder:text-neutral-500 font-sans font-semibold"
				on:keydown={(e) => {
					if (e.key == 'Enter' && e.ctrlKey) {
						cast();
					}
				}}
			/>
			<div class="flex items-center">
				<button class="focus:outline-none" on:click={toggleNewCastTextbox}
					><svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6 text-neutral-400 hover:text-neutral-200 transition"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
				<div class="flex-1" />
				{#if !isSending}
					<button
						class="bg-neutral-50 text-neutral-800 hover:bg-neutral-800 hover:text-neutral-50 border border-neutral-50 transition px-3 py-1 rounded-lg font-mono focus:outline-none text-base"
						on:click={cast}>Cast</button
					>
				{:else}
					<button
						class="bg-neutral-700 text-neutral-400  px-3 py-1 rounded-lg font-mono focus:outline-none text-base"
						in:fade={{ duration: 200 }}>Cast</button
					>
				{/if}
			</div>
		</div>
	{/if}
</div>
