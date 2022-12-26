<script lang="ts">
	import { goto } from '$app/navigation';

	let searchQuery = '';
	function search() {
		goto(`/search?q=${searchQuery}`);
	}
</script>

<div
	class="h-screen w-screen bg-neutral-900 absolute left-0 top-0 flex items-center justify-center"
>
	<div class="flex items-center px-6 space-x-2">
		<input
			class="w-full focus:outline-none placeholder:text-neutral-600 bg-neutral-900 md:text-2xl text-xl font-[900]"
			autofocus
			placeholder="Search Farcaster"
			type="text"
			name=""
			id=""
			bind:value={searchQuery}
			on:keydown={(e) => {
				if (e.key == 'Enter') {
					search();
				}
			}}
		/>
		<button
			class="focus:outline-none bg-neutral-50 text-neutral-900 p-3 rounded-xl border border-neutral-50 hover:bg-neutral-900 hover:text-neutral-50 transition"
			on:click={search}
		>
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
					d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
				/>
			</svg>
		</button>
	</div>
</div>
