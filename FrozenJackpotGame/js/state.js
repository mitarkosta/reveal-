// js/state.js
// centralized game state container
export const GameState = {
  totalSpins: 0,      // persisted across sessions
  sessionSpins: 0,    // resets per page load if desired
  isSpinning: false,
  jackpot: false,
  lastOutcome: null
};

export function incTotal(){ GameState.totalSpins += 1; GameState.sessionSpins += 1; }
export function resetSession(){ GameState.sessionSpins = 0; }
export function setSpinning(v){ GameState.isSpinning = !!v; }
export function setLastOutcome(o){ GameState.lastOutcome = o; }
export function setJackpot(v){ GameState.jackpot = !!v; }
