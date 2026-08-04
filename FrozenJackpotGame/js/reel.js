// js/reel.js — reels controller: start each reel with stagger
export default class ReelsController{
  constructor(container, symbols, onTick){
    this.container = container;
    this.symbols = symbols;
    this.onTick = onTick || (()=>{});
    this.reels = Array.from(container.querySelectorAll('.reel'));
    // internal positions
    this.pos = this.reels.map(()=>0);
  }

  _randIndex(){ return Math.floor(Math.random() * this.symbols.length); }

  async _spinSingle(i, duration=1200){
    const reelEl = this.reels[i];
    const start = performance.now();
    while(true){
      const now = performance.now();
      const elapsed = now - start;
      const p = Math.min(1, elapsed/duration);
      const freq = 30 - Math.floor(28 * p);
      if(Math.random() < (1/freq)){
        this.pos[i] = this._randIndex();
        reelEl.textContent = this.symbols[this.pos[i]];
        this.onTick(i, this.symbols[this.pos[i]]);
      }
      if(p>=1) break;
      await new Promise(r=>requestAnimationFrame(r));
    }
    return this.symbols[this.pos[i]];
  }

  // spin all reels with staggered start delays
  async spinAll(stagger=[0,150,300]){
    const promises = this.reels.map((r,i)=>{
      const delay = stagger[i]||0;
      return new Promise(resolve=>setTimeout(()=>{
        this._spinSingle(i).then(resolve);
      }, delay));
    });
    return Promise.all(promises);
  }
}
