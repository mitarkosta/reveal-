// js/main.js — bootstraps Game and UI wiring
import Game from './game.js';
import { State } from './state.js';
import { CONFIG } from './config.js';

const game = new Game();

function init(){
  const spinBtn = document.getElementById('spin');
  spinBtn.addEventListener('click', async ()=>{
    if(State.isSpinning) return;
    await game.spin();
  });

  // initial render of reels handled by Game/ReelsController when spinning
  game.updateProgress();
}

window.addEventListener('DOMContentLoaded', init);
export default game;
