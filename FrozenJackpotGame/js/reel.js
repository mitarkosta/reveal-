// Reel module: encapsulates a single reel's symbols and spin logic
export default class Reel{
  constructor(symbols){
    this.symbols = Array.from(symbols);
    this.pos = 0;
  }

  // pick a random index
  _randIndex(){
    return Math.floor(Math.random() * this.symbols.length);
  }

  // spin for duration (ms), calling onTick(symbol) periodically with the currently visible symbol
  spinRandom(duration = 1500, onTick = ()=>{}){
    const start = performance.now();
    const symbols = this.symbols;

    return new Promise(resolve=>{
      const step = () =>{
        const now = performance.now();
        const elapsed = now - start;

        // progress 0..1
        const p = Math.min(1, elapsed/duration);

        // choose an index that accelerates/decelerates — using ease-out
        const freq = 30 - Math.floor(28 * p); // high frequency early, lower later
        // show a random symbol every few frames based on freq
        if(Math.random() < (1/freq)){
          this.pos = this._randIndex();
          onTick(symbols[this.pos]);
        }

        if(p < 1) requestAnimationFrame(step);
        else resolve(symbols[this.pos]);
      };
      step();
    });
  }
}
