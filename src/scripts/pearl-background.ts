import { lightWeights, scrollProgress } from './scroll-progress';

const background = document.querySelector<HTMLElement>('.pearl-background');
if (background) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let pendingFrame = 0;
  let previous = -1;
  let active = false;
  const update = () => {
    pendingFrame = 0;
    const progress = scrollProgress(window.scrollY, document.documentElement.scrollHeight, window.innerHeight);
    if (progress === previous) return;
    previous = progress;
    const weights = lightWeights(progress);
    background.style.setProperty('--sage-light', String(weights.sage));
    background.style.setProperty('--lilac-light', String(weights.lilac));
    background.style.setProperty('--pink-light', String(weights.pink));
    background.dataset.scrollProgress = String(progress);
  };
  const schedule = () => { if (!pendingFrame && active) pendingFrame = requestAnimationFrame(update); };
  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null;
  const syncPreference = () => {
    if (reducedMotion.matches) {
      active = false;
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('pageshow', schedule);
      window.visualViewport?.removeEventListener('resize', schedule);
      observer?.disconnect();
      if (pendingFrame) cancelAnimationFrame(pendingFrame);
      pendingFrame = 0;
      previous = -1;
      background.removeAttribute('style');
      delete background.dataset.scrollProgress;
    } else if (!active) {
      active = true;
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule, { passive: true });
      window.addEventListener('pageshow', schedule);
      window.visualViewport?.addEventListener('resize', schedule, { passive: true });
      observer?.observe(document.body);
      observer?.observe(document.documentElement);
      schedule();
      void document.fonts.ready.then(schedule);
    }
  };
  reducedMotion.addEventListener('change', syncPreference);
  syncPreference();
}
