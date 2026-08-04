// Reel module
export default class Reel{
  constructor(symbols){
    this.symbols = Array.from(symbols);
    this.pos = 0;
  }

  _randIndex(){
    return Math.floor(Math.random() * this.symbols.length);
  }

  spinRandom(duration = 1500, onTick = ()=>{}){
    const start = performance.now();
    const symbols = this.symbols;

    return new Promise(resolve=>{
      const step = () =>{
        const now = performance.now();
        const elapsed = now - start;
        const p = Math.min(1, elapsed/duration);
        const freq = 30 - Math.floor(28 * p);
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
