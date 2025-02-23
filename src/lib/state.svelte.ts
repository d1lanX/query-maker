import { SvelteMap } from 'svelte/reactivity';
import type { RecentQuery } from './types';

interface GlobalState {
  recentQueries: SvelteMap<string, RecentQuery>;
}

export const globalState = $state<GlobalState>({
  recentQueries: new SvelteMap(),
});
