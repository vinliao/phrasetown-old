<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { userHubKeyWritable } from '$lib/stores';
	import { goto } from '$app/navigation';

	// on connect, encode it like this because the url is hostile towards +/=
	// decode it later over here
	function internalBase64Encode(input: string) {
		return input.replaceAll('+', '.').replaceAll('/', '_').replaceAll('=', '-');
	}

	function internalBase64Decode(input: string) {
		return input
			.replaceAll('.', '+')
			.replaceAll('_', '/')
			.replaceAll('-', '=')
			.replace('MK=', 'MK-');
	}

	// type, certain length, starts with MK whatever, should be typed
	const userHubKeyParamsRaw = $page.url.searchParams.get('k');
	if (browser) {
		if (userHubKeyParamsRaw) {
			const userHubKeyParams = internalBase64Decode(userHubKeyParamsRaw);

			(async function () {
				const profileResponse = await fetch('/api/me', {
					method: 'PUT',
					body: JSON.stringify({ userHubKey: userHubKeyParams })
				});

				const profile = await profileResponse.json();
				const username = profile.username;
				const fid = profile.fid;

				const keyHash = '70d29a9c1ed39e8ceb1b4ccdbd3f19b5'; // md5 of "farcaster"

				// if key valid, save on localStorage, overwrite old ones
				// if not, throw error or something
				if (username && fid) {
					// base64 is not url-friendly, use this encode-decode function
					// to pass the base64 data
					localStorage.setItem(keyHash, userHubKeyParams);
					userHubKeyWritable.set(userHubKeyParams);
					goto('/welcome', { replaceState: true });
				}
			})();
		}
	}
</script>
