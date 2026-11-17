(() => {
  const KEY = 'alora-theme';
  const ORDER = ['auto', 'light', 'dark'];
  const PAGE = { light: '#F3F0FD', dark: '#06090B' };
  const root = document.documentElement;

  const read = () => {
    try {
      const value = localStorage.getItem(KEY);
      return ORDER.includes(value) ? value : 'auto';
    } catch {
      return 'auto';
    }
  };
  const write = (value) => {
    try {
      if (value === 'auto') localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, value);
    } catch {}
  };

  const apply = (choice) => {
    if (choice === 'auto') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', choice);
    for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
      const own = meta.media.includes('dark') ? PAGE.dark : PAGE.light;
      meta.content = choice === 'auto' ? own : PAGE[choice];
    }
  };

  let current = read();
  apply(current);

  document.addEventListener('DOMContentLoaded', () => {
    apply(current);
    for (const button of document.querySelectorAll('[data-theme-toggle]')) {
      const label = (choice) =>
        `${button.dataset.label}: ${button.dataset[`label${choice[0].toUpperCase()}${choice.slice(1)}`]}`;
      const show = (choice) => {
        button.dataset.choice = choice;
        button.setAttribute('aria-label', label(choice));
        button.title = label(choice);
      };
      show(current);
      button.hidden = false;
      button.addEventListener('click', () => {
        current = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
        write(current);
        apply(current);
        show(current);
      });
    }
  });
})();
