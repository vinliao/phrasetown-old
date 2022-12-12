<script lang="ts">
	export let name: string;
	export let backButton = false;
</script>

<div class="p-4 flex items-center space-x-4">
	{#if backButton}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-6 h-6 hover:cursor-pointer"
			on:click={() => {
				window.history.back();
			}}
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
			/>
		</svg>
	{/if}
	<span class="text-xl font-bold">{name}</span>
	<div class="flex-1" />
</div>
<div class="h-0.5 w-full bg-[#0a0a0a]" />
