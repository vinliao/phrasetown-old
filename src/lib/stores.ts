import { type Writable, writable } from 'svelte/store';

export const showNotice: Writable<string | undefined> = writable(undefined);
export const showNoticeError: Writable<string | undefined> = writable(undefined);


export const userHubKeyWritable: Writable<string | undefined> = writable(undefined);
export const fidWritable: Writable<number | undefined> = writable(undefined);
export const usernameWritable: Writable<string | undefined> = writable(undefined);

export const programmaticallyRefreshColumn: Writable<boolean> = writable(false);