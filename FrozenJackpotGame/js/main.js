// js/main.js — bootstrap and wiring
import Game from './game.js';
import { GameState } from './state.js';

const game = new Game();

function init(){
  const spinBtn = document.getElementById('spin');
  spinBtn.addEventListener('click', async ()=>{
    // resume audio context on first user gesture if needed
    try{ if(game.sound && game.sound.ctx && game.sound.ctx.state === 'suspended') await game.sound.ctx.resume(); }catch(e){}
    await game.spin();
    game.updateProgress();
  });

  // initial UI updates
  game.updateProgress();
}

window.addEventListener('DOMContentLoaded', init);
export default game;
