// game.js — updated import to use reels.js
import Reel from './reels.js';
import Storage from './storage.js';
import Sound from './sound.js';
import { SYMBOLS } from './config.js';

export default class Game{
  constructor({onUpdate=()=>{}}={}){
    this.onUpdate = onUpdate;
    this.sound = new Sound();
    this.storage = new Storage('frozen-jackpot:v1');

    const saved = this.storage.load() || {};
    this.balance = Number(saved.balance ?? 50);
    this.bet = Number(saved.bet ?? 1);
    this.reels = [new Reel(SYMBOLS), new Reel(SYMBOLS), new Reel(SYMBOLS)];
    this.current = saved.current || ['🍒','🍋','⭐'];
    this.holds = saved.holds || [false,false,false];
    this.soundOn = saved.soundOn ?? true;
    this.message = 'Good luck!';

    this._notify();
  }

  // ... rest remains unchanged (omitted for brevity)
  getState(){ return { balance:this.balance, bet:this.bet, reels:this.current, holds:this.holds, message:this.message }; }
  toggleSound(){ this.soundOn = !this.soundOn; this._notify(); this.save(); return this.soundOn; }
  toggleHold(index){ this.holds[index] = !this.holds[index]; this._notify(); this.save(); }
  async spin(bet){ if(bet<=0) return null; if(this.balance < bet){ this.message = 'Not enough balance'; this._notify(); return null; } this.bet = bet; this.balance -= bet; this.message='Spinning...'; this._notify(); if(this.soundOn) this.sound.playStart(); const spinPromises = this.reels.map((reel,i)=>{ if(this.holds[i]) return new Promise(resolve=>setTimeout(()=>resolve(this.current[i]),250+i*120)); return reel.spinRandom(1600 + i*300, (sym)=>{ this.current[i]=sym; if(this.soundOn) this.sound.playTick(); this._notify(); }); }); const results = await Promise.all(spinPromises); this.current = results.slice(); if(this.soundOn) this.sound.playStop(); const payout = this._evaluate(results); if(payout>0){ this.balance += payout; this.message = `You won $${payout}!`; if(this.soundOn) this.sound.playWin(); } else { this.message = 'No win — try again.';} const outcome = {results:this.current.slice(), payout}; this._notify(); this.save(); return outcome; }
  _evaluate(results){ const [a,b,c]=results; if(a===b && b===c){ switch(a){ case '7️⃣': return this.bet*50; case '💎': return this.bet*30; case '⭐': return this.bet*20; default: return this.bet*10; } } if(a===b || a===c || b===c) return this.bet*2; return 0; }
  reset(){ this.balance=50; this.bet=1; this.current=['🍒','🍋','⭐']; this.holds=[false,false,false]; this.message='Game reset.'; this.save(); this._notify(); }
  save(){ const payload={balance:this.balance,bet:this.bet,current:this.current,holds:this.holds,soundOn:this.soundOn}; this.storage.save(payload); }
  _notify(){ this.onUpdate(this.getState()); }
}
