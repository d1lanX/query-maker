import { SvelteMap } from 'svelte/reactivity';
import type { RecentQuery } from './types';

interface GlobalState {
    recentQueries: SvelteMap<string, RecentQuery>;
    isCallbackValid: boolean;
}

export const globalState = $state<GlobalState>({
    recentQueries: new SvelteMap(),
    isCallbackValid: true,
});
