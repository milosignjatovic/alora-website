(() => {
  for (const button of document.querySelectorAll('[data-print]')) {
    button.hidden = false;
    button.addEventListener('click', () => window.print());
  }
  if (!('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('motion');

  const steps = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.intersectionRatio >= 0.45) entry.target.classList.add('play');
      else if (!entry.isIntersecting) entry.target.classList.remove('play');
    }
  }, { threshold: [0, 0.45] });
  document.querySelectorAll('.step').forEach((step) => steps.observe(step));

  const links = new Map([...document.querySelectorAll('.toc a')].map((a) => [a.hash.slice(1), a]));
  let current;
  const toc = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const link = links.get(entry.target.id);
      if (!link || link === current) continue;
      current?.classList.remove('active');
      current?.removeAttribute('aria-current');
      link.classList.add('active');
      link.setAttribute('aria-current', 'step');
      current = link;
      const strip = link.closest('.toc');
      if (getComputedStyle(strip).overflowX === 'auto') {
        strip.scrollTo({ left: link.offsetLeft - (strip.clientWidth - link.offsetWidth) / 2, behavior: 'smooth' });
      }
    }
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('.step').forEach((step) => toc.observe(step));
})();
