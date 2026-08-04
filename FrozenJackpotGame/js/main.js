// main.js — lightweight module to bootstrap the skeleton (connects later to modules)
import Game from './game.js';
import { getState, subscribe } from './state.js';

const game = new Game({onUpdate});

function onUpdate(state){
  // minimal initial render: create reels if missing
  const reelsContainer = document.getElementById('reels');
  if(reelsContainer.children.length === 0){
    state.reels.forEach((s,i)=>{
      const r = document.createElement('div'); r.className='reel'; r.dataset.index = i; r.textContent = s; reelsContainer.appendChild(r);
    });
  } else {
    state.reels.forEach((s,i)=>{
      const r = reelsContainer.querySelector(`.reel[data-index="${i}"]`); if(r) r.textContent = s;
    });
  }
}

subscribe(onUpdate);

// wire basic buttons
const spinButton = document.getElementById('spinButton');
spinButton.addEventListener('click', async ()=>{
  // placeholder — will connect to game.spin when modules finalized
  console.log('spin clicked');
});

export default game;
