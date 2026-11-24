export const initialState = Object.freeze({ hasLamp: false, revealed: false });
export function advance(state) {
  if (state.revealed) return initialState;
  if (state.hasLamp) return { hasLamp: true, revealed: true };
  return { hasLamp: true, revealed: false };
}

