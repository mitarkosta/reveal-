// state.js — simple in-memory state manager
import { NUM_REELS } from './config.js';

const defaultState = {
  balance: 50,
  bet: 1,
  reels: Array.from({length:NUM_REELS}, ()=>'🍒'),
  holds: Array.from({length:NUM_REELS}, ()=>false)
};

let _state = {...defaultState};
const listeners = new Set();

export function getState(){ return {..._state}; }
export function setState(patch){ _state = {..._state, ...patch}; notify(); }
export function subscribe(cb){ listeners.add(cb); return ()=>listeners.delete(cb); }
function notify(){ listeners.forEach(cb=>cb(getState())); }
export function resetState(){ _state = {...defaultState}; notify(); }
