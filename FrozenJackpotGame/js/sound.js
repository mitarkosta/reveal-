// js/sound.js — WebAudio wrapper with lazy init and named effects
export default class Sound{
  constructor(){ this.ctx = null; this.master = null; }
  _init(){
    if(this.ctx) return;
    try{
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain(); this.master.gain.value = 0.12; this.master.connect(this.ctx.destination);
    }catch(e){ this.ctx = null; }
  }

  _beep(freq=440, length=0.08, type='sine', when=0){
    this._init(); if(!this.ctx) return;
    const o = this.ctx.createOscillator(); const g = this.ctx.createGain(); o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, this.ctx.currentTime + when);
    g.gain.exponentialRampToValueAtTime(1.0, this.ctx.currentTime + when + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + when + length);
    o.connect(g); g.connect(this.master);
    o.start(this.ctx.currentTime + when); o.stop(this.ctx.currentTime + when + length + 0.02);
  }

  // spin loop start
  spin(){ this._beep(880,0.06,'sawtooth'); this._beep(660,0.08,'sine',0.02); }
  stop(){ this._beep(520,0.08,'sine'); }
  win(){ let t=0; [880,1100,1320].forEach(f=>{ this._beep(f,0.12,'sine',t); t+=0.12; }); }
  lever(){ this._beep(560,0.06,'square'); }
  tick(){ this._beep(1200,0.03,'square'); }
  jackpot(){ this._beep(220,0.6,'sine'); }
}
