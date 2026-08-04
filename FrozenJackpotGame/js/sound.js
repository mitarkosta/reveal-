// sound.js — kept existing implementation
export default class Sound{
  constructor(){ this.ctx = null; this.masterGain = null; }
  _init(){ if(this.ctx) return; try{ this.ctx = new (window.AudioContext||window.webkitAudioContext)(); this.masterGain = this.ctx.createGain(); this.masterGain.gain.value = 0.12; this.masterGain.connect(this.ctx.destination);}catch(e){ this.ctx = null; }}
  _beep(freq=440, length=0.08, type='sine', when=0){ this._init(); if(!this.ctx) return; const o = this.ctx.createOscillator(); const g = this.ctx.createGain(); o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(0.0001, this.ctx.currentTime + when); g.gain.exponentialRampToValueAtTime(1.0, this.ctx.currentTime + when + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + when + length); o.connect(g); g.connect(this.masterGain); o.start(this.ctx.currentTime + when); o.stop(this.ctx.currentTime + when + length + 0.02); }
  playStart(){ this._beep(880, 0.06,'sawtooth'); this._beep(660, 0.08,'sine',0.02); }
  playTick(){ this._beep(1200, 0.035,'square'); }
  playStop(){ this._beep(520, 0.08,'sine'); }
  playWin(){ let t=0; [880,1100,1320].forEach(f=>{ this._beep(f,0.12,'sine',t); t+=0.12; }); }
}
