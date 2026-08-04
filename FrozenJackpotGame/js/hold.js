// hold.js — simple helper to toggle holds (per reel)
export function toggleHold(state, index){
  const holds = Array.from(state.holds);
  holds[index] = !holds[index];
  return {...state, holds};
}
