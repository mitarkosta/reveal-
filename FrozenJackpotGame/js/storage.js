// js/storage.js — persistent storage for total/session spins
import { CONFIG } from './config.js';

export default class Storage{
  constructor(){ this.key = CONFIG.STORAGE_KEY; }
  saveProgress(totalSpins, sessionSpins){
    try{ const payload = { totalSpins: Number(totalSpins||0), sessionSpins: Number(sessionSpins||0), updated: new Date().toISOString() }; localStorage.setItem(this.key, JSON.stringify(payload)); }catch(e){console.warn(e);} }
  loadProgress(){ try{ const raw = localStorage.getItem(this.key); return raw?JSON.parse(raw):{totalSpins:0,sessionSpins:0}; }catch(e){return {totalSpins:0,sessionSpins:0}; } }
  clear(){ try{ localStorage.removeItem(this.key);}catch(e){} }
}
