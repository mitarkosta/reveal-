// js/game.js — orchestration: spins, anticipation, progress, jackpot
import ReelsController from './reel.js';
import Sound from './sound.js';
import Storage from './storage.js';
import { GameState, incTotal, setSpinning, setLastOutcome, setJackpot } from './state.js';
import { CONFIG } from './config.js';

export default class Game{
  constructor(){
    this.sound = new Sound();
    this.storage = new Storage();
    this.container = document.getElementById('slotWindow');
    this.reels = new ReelsController(this.container, ()=>{});
    this.progressBar = document.getElementById('bar');
    this.counter = document.getElementById('counter');
    this.status = document.getElementById('status');
    this.message = document.getElementById('message');
    this.lever = document.getElementById('lever');

    // load persisted progress
    const p = this.storage.loadProgress();
    GameState.totalSpins = Number(p.totalSpins || 0);
    GameState.sessionSpins = Number(p.sessionSpins || 0);
    this.updateProgress();
  }

  async spin(){
    if(GameState.isSpinning || GameState.jackpot) return null;
    setSpinning(true);

    // lever animation + sound
    if(this.lever){ this.lever.classList.add('pull'); this.sound.lever(); setTimeout(()=> this.lever.classList.remove('pull'), 600); }

    // ensure audio is resumed (lazy init) — browsers require user gesture
    if(this.sound && this.sound.ctx && this.sound.ctx.state === 'suspended'){ this.sound.ctx.resume().catch(()=>{}); }

    // start spin sound
    this.sound.spin();

    // update state
    incTotal();
    this.storage.saveProgress(GameState.totalSpins, GameState.sessionSpins);
    this.updateProgress();

    // anticipation check: every ANTICIPATION_INTERVAL
    const isAnticipation = (GameState.totalSpins % CONFIG.ANTICIPATION_INTERVAL) === 0;
    if(isAnticipation){ this._doAnticipation(); }

    // perform reels spin with stagger and durations; slow third reel on anticipation
    const slowThird = isAnticipation;
    const results = await this.reels.spinAll(CONFIG.REEL_DELAY, CONFIG.REEL_DURATIONS, slowThird);

    // stop sound
    this.sound.stop();

    // evaluate
    const payout = this._evaluate(results);
    const outcome = { results, payout };
    setLastOutcome(outcome);

    if(payout > 0){ this.message.textContent = `You won $${payout}!`; this.sound.win(); }
    else { this.message.textContent = this._anticipationText(); }

    // check jackpot
    if(GameState.totalSpins >= CONFIG.TOTAL_SPINS){ this._doJackpot(); }

    setSpinning(false);
    this.storage.saveProgress(GameState.totalSpins, GameState.sessionSpins);
    return outcome;
  }

  updateProgress(){ const percent = Math.min(100, Math.round((GameState.totalSpins / CONFIG.TOTAL_SPINS)*100)); if(this.progressBar) this.progressBar.style.width = percent + '%'; if(this.counter) this.counter.textContent = `${GameState.totalSpins} / ${CONFIG.TOTAL_SPINS}`; }

  _doAnticipation(){ this.status.textContent = '🔥 SO CLOSE'; this.sound.tick(); // visual cue: glow third reel slightly
    document.querySelectorAll('.reel')[2]?.classList.add('win-scale'); setTimeout(()=>document.querySelectorAll('.reel')[2]?.classList.remove('win-scale'), 800);
  }

  _anticipationText(){ const mod = GameState.totalSpins % CONFIG.ANTICIPATION_INTERVAL; switch(mod){ case 1: return 'Almost...'; case 2: return 'So close...'; case 3: return 'One symbol away'; case 4: return 'Nearly there'; case 0: return '🔥 SO CLOSE'; default: return 'Good luck!'; } }

  _evaluate(results){ const [a,b,c] = results; if(a===b && b===c){ switch(a){ case '7️⃣': return 1000; case '💎': return 500; case '⭐': return 300; default: return 200; } } if(a===b || a===c || b===c) return 20; return 0; }

  _doJackpot(){ setJackpot(true); this.status.textContent='JACKPOT!'; this.sound.jackpot(); // visual freeze + confetti + gold glow
    const machine = document.getElementById('machine'); machine.classList.add('glow');
    // show overlay
    const overlay = document.getElementById('jackpotOverlay'); overlay.classList.add('active'); overlay.setAttribute('aria-hidden','false');
    // confetti
    this._confettiBurst(80);
    // show final note after short delay
    setTimeout(()=>{
      // keep overlay visible; after some seconds you can reset or continue
    }, 2000);
  }

  _confettiBurst(n=40){ const root = document.createElement('div'); root.className='confetti'; document.body.appendChild(root);
    for(let i=0;i<n;i++){ const p = document.createElement('div'); p.className='piece'; p.style.left = (Math.random()*100)+'%'; p.style.top = '-5%'; p.style.background = `hsl(${Math.random()*60 + 40},80%,60%)`; p.style.transform = `rotate(${Math.random()*360}deg)`; root.appendChild(p);
      const duration = 1800 + Math.random()*1200;
      p.animate([{transform:`translateY(0) rotate(${Math.random()*360}deg)` , opacity:1},{transform:`translateY(${80 + Math.random()*120}vh) rotate(${Math.random()*720}deg)`, opacity:0}],{duration, easing:'cubic-bezier(.2,.8,.2,1)'});
    }
    setTimeout(()=> root.remove(), 4000);
  }
}
