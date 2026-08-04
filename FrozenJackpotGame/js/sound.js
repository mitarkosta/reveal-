// js/sound.js — WebAudio simplified for spin/tick/jackpot/freeze
export default class Sound{
  constructor(){ this.ctx=null; this.g=null; }
  _init(){ if(this.ctx) return; try{ this.ctx = new (window.AudioContext||window.webkitAudioContext)(); this.g = this.ctx.createGain(); this.g.gain.value = 0.12; this.g.connect(this.ctx.destination);}catch(e){this.ctx=null;} }
  _beep(freq=440,len=0.08,type='sine',when=0){ this._init(); if(!this.ctx) return; const o=this.ctx.createOscillator(); const g=this.ctx.createGain(); o.type=type; o.frequency.value=freq; g.gain.setValueAtTime(0.0001,this.ctx.currentTime+when); g.gain.exponentialRampToValueAtTime(1.0,this.ctx.currentTime+when+0.01); g.gain.exponentialRampToValueAtTime(0.0001,this.ctx.currentTime+when+len); o.connect(g); g.connect(this.g); o.start(this.ctx.currentTime+when); o.stop(this.ctx.currentTime+when+len+0.02); }
  spin(){ this._beep(900,0.06,'sawtooth'); this._beep(700,0.08,'sine',0.02); }
  stop(){ this._beep(520,0.08,'sine'); }
  jackpot(){ let t=0; [880,1100,1320].forEach(f=>{ this._beep(f,0.12,'sine',t); t+=0.12; }); }
  freeze(){ this._beep(220,0.6,'sine'); }
  tickFast(){ this._beep(1200,0.03,'square'); }
}
