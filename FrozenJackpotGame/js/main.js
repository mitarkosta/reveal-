import Game from './game.js';
import Leaderboard from './leaderboard.js';

const EMOJI_TO_ASSET = {
  '🍒': 'cherry.svg',
  '🍋': 'lemon.svg',
  '🔔': 'bell.svg',
  '⭐': 'star.svg',
  '💎': 'diamond.svg',
  '7️⃣': 'seven.svg',
  '🍊': 'orange.svg'
};

const spinButton = document.getElementById('spinButton');
const resetButton = document.getElementById('resetButton');
const betInput = document.getElementById('betInput');
const balanceEl = document.getElementById('balance');
const messageEl = document.getElementById('message');
const holdButtons = Array.from(document.querySelectorAll('.hold'));
const soundToggle = document.getElementById('soundToggle');
const openLeaderboard = document.getElementById('openLeaderboard');
const leaderboardEl = document.getElementById('leaderboard');
const particles = document.getElementById('particles');

const game = new Game({onUpdate});
const leaderboard = new Leaderboard('frozen-jackpot:leaderboard');

function onUpdate(state){
  balanceEl.textContent = `Balance: $${state.balance}`;
  messageEl.textContent = state.message || '';

  // update reel visuals (use asset mapping)
  state.reels.forEach((sym, i)=>{
    const reelImg = document.querySelector(`.reel[data-index="${i}"] .symbol-img`);
    if(reelImg){
      const filename = EMOJI_TO_ASSET[sym] || 'cherry.svg';
      reelImg.src = `assets/symbols/${filename}`;
      // small win effect
      if(state.lastWin && state.lastWin > 0){
        reelImg.style.transform = 'scale(1.16)';
        setTimeout(()=> reelImg.style.transform = '', 300);
      }
    }
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
  const result = await game.spin(bet);
  spinButton.disabled = false;

  // if win large enough, save to leaderboard
  if(result && result.payout && result.payout >= bet * 20){
    const name = prompt('Big win! Enter your name for the leaderboard (or leave blank):') || 'Player';
    leaderboard.addEntry({name, score: result.payout});
    renderLeaderboard();
  }

  // particles on win
  if(result && result.payout && result.payout > 0){
    burstParticles(12);
  }
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
    renderLeaderboard();
  }
});

soundToggle.addEventListener('click', ()=>{
  const on = game.toggleSound();
  soundToggle.textContent = on ? '🔊' : '🔈';
});

openLeaderboard.addEventListener('click', ()=>{
  renderLeaderboard(true);
});

function renderLeaderboard(open=false){
  const list = leaderboard.getTop(10);
  leaderboardEl.innerHTML = `<h3>Leaderboard</h3>` + (list.length ? `<ol>${list.map(e=>`<li>${escapeHtml(e.name)} — $${e.score} <small>(${new Date(e.date).toLocaleDateString()})</small></li>`).join('')}</ol>` : `<div class="empty">No entries yet</div>` ) + `<div style="margin-top:8px"><button id="clearLb" class="btn">Clear</button></div>`;
  document.getElementById('clearLb').addEventListener('click', ()=>{ if(confirm('Clear leaderboard?')){ leaderboard.clear(); renderLeaderboard(); }});
  if(open) document.querySelector('.sidebar').scrollIntoView({behavior:'smooth'});
}

function burstParticles(count=8){
  for(let i=0;i<count;i++){
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = (50 + (Math.random()-0.5)*20) + '%';
    p.style.top = (50 + (Math.random()-0.5)*8) + '%';
    p.style.background = `radial-gradient(circle,var(--accent-2), rgba(0,0,0,0))`;
    particles.appendChild(p);
    setTimeout(()=> p.remove(), 900);
  }
}

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

// initial render
onUpdate(game.getState());
renderLeaderboard();

// expose for debugging
window.game = game;
window.leaderboard = leaderboard;
