// hold.js — lightweight toggle helper (kept as small compatible module)
export function toggleHold(state, index){
  const holds = Array.from((state && state.holds) || []);
  holds[index] = !holds[index];
  return {...state, holds};
}
