// js/reel.js — Reels controller: vertical track animation
import { CONFIG } from './config.js';

export default class ReelsController{
  constructor(container, onTick){
    this.container = container;
    this.symbols = CONFIG.SYMBOLS;
    this.onTick = onTick || (()=>{});
    this.reels = Array.from(container.querySelectorAll('.reel'));
    this.itemHeight = 86; // must match CSS .item height
    this._buildTracks();
  }

  _buildTracks(){
    this.reels.forEach((r)=>{
      r.innerHTML = '';
      const track = document.createElement('div'); track.className = 'track';
      // create a long list of symbols for smooth spin
      for(let i=0;i<30;i++){
        const item = document.createElement('div'); item.className = 'item';
        const sym = this.symbols[i % this.symbols.length];
        item.textContent = sym;
        track.appendChild(item);
      }
      r.appendChild(track);
    });
  }

  // helper to compute final offset for a randomly chosen symbol
  _targetOffset(index, symbolIndex){
    // center symbol should be at center of reel viewport
    // choose a position deep in the track to avoid immediate repeats
    const loops = 10; // number of cycles
    const position = loops * this.symbols.length + symbolIndex;
    return -position * this.itemHeight + ( (this.reels[0].clientHeight - this.itemHeight) / 2 );
  }

  _randIndex(){ return Math.floor(Math.random() * this.symbols.length); }

  async _animateReel(i, duration=1200, slowLast=false){
    const reelEl = this.reels[i];
    const track = reelEl.querySelector('.track');
    // pick a random final symbol index
    const targetSymbolIndex = this._randIndex();
    const finalOffset = this._targetOffset(i, targetSymbolIndex);

    // if anticipation and slowLast, increase duration a bit
    if(slowLast) duration = Math.floor(duration * 1.45);

    // set transition duration
    track.style.transition = `transform ${duration}ms cubic-bezier(.2,.8,.3,1)`;

    // trigger repaint then set transform
    requestAnimationFrame(()=>{
      track.style.transform = `translateY(${finalOffset}px)`;
    });

    // mid-spin ticks: optional: call onTick while spinning at intervals
    const tickInterval = 80; let elapsed = 0;
    return new Promise(resolve=>{
      const start = performance.now();
      const step = ()=>{
        const now = performance.now(); elapsed = now - start;
        // call onTick occasionally
        if(Math.random() < 0.12) this.onTick(i, this.symbols[this._randIndex()]);
        if(elapsed < duration){ requestAnimationFrame(step); }
        else { resolve(this.symbols[targetSymbolIndex]); }
      };
      step();
    });
  }

  // start all reels with staggered start delays and stop durations
  async spinAll(startDelays=CONFIG.REEL_DELAY, durations=CONFIG.REEL_DURATIONS, slowThird=false){
    const promises = this.reels.map((r,i)=>{
      const startDelay = startDelays[i] || 0;
      const dur = durations[i] || 1200;
      return new Promise(resolve=>setTimeout(()=>{
        this._animateReel(i, dur, slowThird && i===2).then(resolve);
      }, startDelay));
    });
    return Promise.all(promises);
  }
}
