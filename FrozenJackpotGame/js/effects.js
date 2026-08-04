// effects.js — small helpers (particles, animations)
export function burstParticles(container, count=8){
  for(let i=0;i<count;i++){
    const p = document.createElement('div'); p.className='particle'; p.style.left = (50 + (Math.random()-0.5)*20) + '%'; p.style.top = (50 + (Math.random()-0.5)*8) + '%'; container.appendChild(p); setTimeout(()=>p.remove(),900);
  }
}
