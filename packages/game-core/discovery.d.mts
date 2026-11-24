export interface DiscoveryState { readonly hasLamp: boolean; readonly revealed: boolean }
export const initialState: DiscoveryState;
export function advance(state: DiscoveryState): DiscoveryState;

