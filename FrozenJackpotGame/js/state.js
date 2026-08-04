// js/state.js
import { CONFIG } from './config.js';

export const State = {
  spins: 0,
  session: 0,
  isSpinning: false,
  jackpot: false,
  lastOutcome: null
};

export function incSpin(){ State.spins += 1; }
export function resetSpins(){ State.spins = 0; }
export function setSpinning(v){ State.isSpinning = !!v; }
export function setLastOutcome(o){ State.lastOutcome = o; }
