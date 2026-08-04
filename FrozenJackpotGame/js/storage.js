// Simple localStorage wrapper with JSON handling and try/catch
export default class Storage{
  constructor(key){
    this.key = key;
  }

  save(obj){
    try{
      localStorage.setItem(this.key, JSON.stringify(obj));
    }catch(e){
      console.warn('Storage save failed', e);
    }
  }

  load(){
    try{
      const raw = localStorage.getItem(this.key);
      return raw ? JSON.parse(raw) : null;
    }catch(e){
      console.warn('Storage load failed', e);
      return null;
    }
  }

  clear(){
    try{ localStorage.removeItem(this.key); }catch(e){}
  }
}
