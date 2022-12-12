<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	export let message: string;
</script>

<div
	class="bg-green-200 text-green-900 p-3 py-2 rounded-md font-bold fixed z-[1] mt-10 top-0 left-1/2 transform -translate-x-1/2  "
	in:fly={{ y: -25, duration: 200 }}
	out:fade={{ duration: 200 }}
>
	<span>{message}</span>
</div>
