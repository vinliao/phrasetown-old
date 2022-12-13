<script lang="ts">
	import { fade } from 'svelte/transition';
	import { showNotice, showNoticeError, userHubKeyWritable } from '$lib/stores';
	import type { Root } from '$lib/types/merkleUserByUsername';

	export let toggleReplyTextbox = () => {};
	export let cast: CastInterface;

	let replyInput = '';
	import autosize from 'autosize';
	import type { CastInterface } from '$lib/types';

	async function sendCast(fid: number) {
		const response = await fetch('/api/cast', {
			method: 'POST',
			body: JSON.stringify({
				castText: replyInput,
				replyTo: cast.hash,
				fid,
				userHubKey: $userHubKeyWritable
			})
		});

		if (response.ok) {
			toggleReplyTextbox();
			replyInput = '';
			cast.replies++;

			showNotice.set('Cast sent successfully!');
		} else {
			toggleReplyTextbox();
			showNoticeError.set('Oops, something is wrong... Try again?');
		}
	}

	async function fetchFid(username: string): Promise<number> {
		const response = await fetch(`/api/get-user-by-username?username=${username}`);
    const data: Root = await response.json()
    return data.data.result.user.fid;
	}

	let isSending = false;
	async function reply() {
		if (!$userHubKeyWritable) {
			showNoticeError.set('Error: wallet not connected!');
			toggleReplyTextbox();
			replyInput = '';
		} else {
			isSending = true;
			if (cast.author.fid) await sendCast(cast.author.fid);
			else sendCast(await fetchFid(cast.author.username));
			isSending = false;
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="w-screen h-screen fixed top-0 left-0 right-0 bottom-0 z-50 backdrop-blur-sm flex items-center justify-center backdrop-brightness-75"
	on:click={toggleReplyTextbox}
	transition:fade={{ duration: 200 }}
>
	<div class="rounded-2xl bg-neutral-800 p-4 flex w-96" on:click|stopPropagation>
		<div class="w-full">
			<p class="mb-1 text-neutral-500">@{cast.author.username} says:</p>
			<p class="mb-4 whitespace-pre-wrap break-words text-neutral-400">{@html cast.text}</p>
			<div class="mb-4 border-t border-neutral-700" />
			<textarea
				bind:value={replyInput}
				use:autosize
				autofocus
				rows="2"
				placeholder="Your reply..."
				class="w-full focus:outline-none placeholder:text-neutral-500 bg-neutral-800 text-lg mb-3"
				on:keydown={(e) => {
					if (e.key == 'Enter' && e.ctrlKey) {
						reply();
					}
				}}
			/>
			<div class="flex items-center">
				<button class="focus:outline-none" on:click={toggleReplyTextbox}
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
						class="bg-neutral-50 hover:bg-neutral-200 transition px-3 py-1.5 rounded-lg text-neutral-800 font-mono focus:outline-none"
						on:click={reply}>Reply</button
					>
				{:else}
					<button
						class="bg-neutral-700 px-3 py-1.5 rounded-lg text-neutral-400 font-mono focus:outline-none"
						in:fade={{ duration: 200 }}>Reply</button
					>
				{/if}
			</div>
		</div>
	</div>
</div>
