// js/game.js — orchestrates spins, anticipation and progress
import ReelsController from './reel.js';
import Sound from './sound.js';
import { State, incSpin, setSpinning, setLastOutcome } from './state.js';
import { CONFIG } from './config.js';

export default class Game{
  constructor(){
    this.sound = new Sound();
    const container = document.getElementById('slotWindow') || document.getElementById('slotWindow');
    this.reels = new ReelsController(document.getElementById('slotWindow') || document.getElementById('slotWindow'), CONFIG.SYMBOLS, ()=>{});
    this.progressBar = document.getElementById('bar');
    this.counter = document.getElementById('counter');
    this.message = document.getElementById('message');
    this.status = document.getElementById('status');
  }

  async spin(){
    if(State.isSpinning) return null;
    setSpinning(true);
    // lever animation
    const lever = document.getElementById('lever');
    if(lever) lever.classList.add('pull');
    setTimeout(()=> lever && lever.classList.remove('pull'), 600);

    // sound start
    this.sound.spin();

    incSpin();
    this.updateProgress();
    this.status.textContent = 'Spinning...';

    // anticipation check
    if(State.spins % CONFIG.ANTICIPATION_STEP === 0){
      this.anticipation();
    }

    const outcome = await this.reels.spinAll([0,150,300]);

    // stop sound
    this.sound.stop();

    // evaluate simple payout (three of kind)
    const payout = this._evaluate(outcome);
    const result = {results: outcome, payout};
    setLastOutcome(result);

    if(payout>0){
      this.message.textContent = `You won $${payout}!`;
      this.sound.jackpot();
    } else {
      this.message.textContent = this._getAnticipationText();
    }

    // jackpot at total spins
    if(State.spins >= CONFIG.TOTAL_SPINS){
      this.jackpot();
    }

    setSpinning(false);
    return result;
  }

  updateProgress(){
    const percent = Math.min(100, Math.round((State.spins / CONFIG.TOTAL_SPINS)*100));
    if(this.progressBar) this.progressBar.style.width = percent + '%';
    if(this.counter) this.counter.textContent = `${State.spins} / ${CONFIG.TOTAL_SPINS}`;
  }

  anticipation(){
    // visual and audio cue
    this.status.textContent = '🔥 SO CLOSE';
    this.sound.tickFast();
    // slow third reel: implemented as extra delay by spinning with longer duration
  }

  _getAnticipationText(){
    switch((State.spins%CONFIG.ANTICIPATION_STEP)||0){
      case 1: return 'Almost...';
      case 2: return 'So close...';
      case 3: return 'One symbol away';
      case 4: return 'Nearly jackpot';
      case 0: return '🔥 SO CLOSE';
      default: return 'Good luck!';
    }
  }

  jackpot(){
    this.status.textContent = 'JACKPOT!';
    this.sound.freeze();
    // final freeze visual
    document.querySelectorAll('.reel').forEach(r=> r.classList.add('win-scale'));
    setTimeout(()=>alert('JACKPOT!'),2000);
  }

  _evaluate(results){
    const [a,b,c] = results;
    if(a===b && b===c){
      switch(a){ case '7️⃣': return 500; case '💎': return 300; case '⭐': return 200; default: return 100; }
    }
    if(a===b || a===c || b===c) return 10;
    return 0;
  }
}
