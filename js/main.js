import Game from './game.js';

const app = document.getElementById('app');
const spinButton = document.getElementById('spinButton');
const resetButton = document.getElementById('resetButton');
const betInput = document.getElementById('betInput');
const balanceEl = document.getElementById('balance');
const messageEl = document.getElementById('message');
const holdButtons = Array.from(document.querySelectorAll('.hold'));
const soundToggle = document.getElementById('soundToggle');

const game = new Game({onUpdate});

function onUpdate(state){
  balanceEl.textContent = `Balance: $${state.balance}`;
  messageEl.textContent = state.message || '';

  // update reel visuals
  state.reels.forEach((sym, i)=>{
    const reelEl = document.querySelector(`.reel[data-index="${i}"] .symbol`);
    if(reelEl) reelEl.textContent = sym;
  });

  // update holds
  holdButtons.forEach(btn=>{
    const idx = Number(btn.dataset.index);
    btn.classList.toggle('active', !!state.holds[idx]);
  });
}

// UI bindings
spinButton.addEventListener('click', async ()=>{
  const bet = Math.max(1, Math.floor(Number(betInput.value) || 1));
  spinButton.disabled = true;
  await game.spin(bet);
  spinButton.disabled = false;
});

holdButtons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const idx = Number(btn.dataset.index);
    game.toggleHold(idx);
  });
});

resetButton.addEventListener('click', ()=>{
  if(confirm('Reset saved game?')){
    game.reset();
  }
});

soundToggle.addEventListener('click', ()=>{
  const on = game.toggleSound();
  soundToggle.textContent = on ? '🔊' : '🔈';
});

// initial render
onUpdate(game.getState());

// save periodically
window.addEventListener('beforeunload',()=>game.save());

// expose for debugging
window.game = game;
