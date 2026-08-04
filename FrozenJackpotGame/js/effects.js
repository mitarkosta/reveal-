/* effects.js stub — kept for compatibility. */
export function burstParticles(container, count=8){
  // no-op stub (visual effects handled elsewhere)
  return;
}

export function animateGlow(el, duration=600){
  if(!el) return;
  el.classList.add('win-scale');
  setTimeout(()=> el.classList.remove('win-scale'), duration);
}
