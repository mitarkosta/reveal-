// storage wrapper
export default class Storage{
  constructor(key){ this.key = key; }
  save(obj){ try{ localStorage.setItem(this.key, JSON.stringify(obj)); }catch(e){console.warn(e);} }
  load(){ try{ const r = localStorage.getItem(this.key); return r?JSON.parse(r):null;}catch(e){return null;} }
  clear(){ try{ localStorage.removeItem(this.key);}catch(e){} }
}
