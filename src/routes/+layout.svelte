<script>
	import '../app.postcss';
	import Panel from '$lib/components/Panel.svelte';
	import { navigating } from '$app/stores';
	import nprogress from 'nprogress';
	import '$lib/nprogress.css'; // for customizing the nprogress thing
	import NoticeModal from '$lib/components/NoticeModal.svelte';
	import NoticeModalError from '$lib/components/NoticeModalError.svelte';
	import { showNotice, showNoticeError } from '$lib/stores';
	import { browser } from '$app/environment';
	import { userHubKeyWritable, fidWritable, usernameWritable } from '$lib/stores';

	nprogress.configure({
		minimum: 0.16,
		showSpinner: false
	});

	$: {
		if ($navigating) {
			nprogress.start();
		}
		if (!$navigating) {
			nprogress.done();
		}
	}

	showNotice.subscribe(async (_) => {
		if ($showNotice) {
			await new Promise((r) => setTimeout(r, 3000));
			showNotice.set(undefined);
		}
	});

	showNoticeError.subscribe(async (_) => {
		if ($showNoticeError) {
			await new Promise((r) => setTimeout(r, 3000));
			showNoticeError.set(undefined);
		}
	});

	if (browser) {
		const keyHash = '70d29a9c1ed39e8ceb1b4ccdbd3f19b5'; // md5 of "farcaster"
		const localUserHubKey = localStorage.getItem(keyHash);

		if (localUserHubKey) {
			(async function () {
				const profileResponse = await fetch('/api/me', {
					method: 'PUT',
					body: JSON.stringify({ userHubKey: localUserHubKey })
				});
				const profile = await profileResponse.json();

				if (profile.username && profile.fid) {
					userHubKeyWritable.set(localUserHubKey);
					usernameWritable.set(profile.username);
					fidWritable.set(profile.fid);
				}
			})();
		}
	}
</script>

{#if $showNotice}
	<NoticeModal message={$showNotice} />
{/if}

{#if $showNoticeError}
	<NoticeModalError message={$showNoticeError} />
{/if}

<div class="scrollbar scrollbar-thumb-neutral-400 scrollbar-track-neutral-700 flex">
	<div class="flex-1 justify-end flex relative">
		<Panel />
	</div>
	<div class="max-w-xl w-full bg-neutral-900">
		<slot />
	</div>
	<div class="flex-1" />
</div>
