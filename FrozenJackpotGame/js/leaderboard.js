// simple leaderboard using localStorage
export default class Leaderboard{
  constructor(key){
    this.key = key;
  }

  _load(){
    try{ return JSON.parse(localStorage.getItem(this.key) || '[]'); }catch(e){ return []; }
  }

  _save(list){
    try{ localStorage.setItem(this.key, JSON.stringify(list)); }catch(e){}
  }

  addEntry({name='Player', score=0}){
    const list = this._load();
    list.push({name, score: Number(score), date: new Date().toISOString()});
    list.sort((a,b)=>b.score - a.score);
    this._save(list.slice(0,50));
  }

  getTop(n=10){
    return (this._load()||[]).slice(0,n);
  }

  clear(){ this._save([]); }
}
