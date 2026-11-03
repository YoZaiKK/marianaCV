import { languageDestination } from '../i18n/navigation';

for (const root of document.querySelectorAll<HTMLElement>('[data-language-select]')) {
  const trigger = root.querySelector<HTMLButtonElement>('[role="combobox"]');
  const list = root.querySelector<HTMLElement>('[role="listbox"]');
  const control = root.querySelector<HTMLElement>('[data-language-control]');
  const fallback = root.querySelector<HTMLElement>('[data-language-fallback]');
  const options = Array.from(root.querySelectorAll<HTMLElement>('[role="option"]'));
  if (!trigger || !list || !control || !fallback || !options.length) continue;

  const selected = Math.max(
    0,
    options.findIndex((option) => option.getAttribute('aria-selected') === 'true'),
  );
  let active = selected;
  let search = '';
  let searchTime = 0;
  const isOpen = () => trigger.getAttribute('aria-expanded') === 'true';
  const highlight = (index: number) => {
    active = Math.max(0, Math.min(options.length - 1, index));
    options.forEach((option, position) =>
      option.classList.toggle('is-active', position === active),
    );
    trigger.setAttribute('aria-activedescendant', options[active].id);
    options[active].scrollIntoView({ block: 'nearest' });
  };
  const close = () => {
    trigger.setAttribute('aria-expanded', 'false');
    trigger.removeAttribute('aria-activedescendant');
    list.hidden = true;
    options.forEach((option) => option.classList.remove('is-active'));
    search = '';
  };
  const open = (index = selected) => {
    list.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    highlight(index);
  };
  const choose = (index: number) => {
    const option = options[index];
    close();
    trigger.focus({ preventScroll: true });
    if (index !== selected && option.dataset.href) {
      window.location.assign(languageDestination(option.dataset.href, window.location.href));
    }
  };

  trigger.addEventListener('click', () => (isOpen() ? close() : open()));
  list.addEventListener('pointerdown', (event) => event.preventDefault());
  trigger.addEventListener('keydown', (event) => {
    const opened = isOpen();
    if (event.key === 'Escape') {
      if (opened) {
        event.preventDefault();
        close();
      }
      return;
    }
    // Switching pages is committed explicitly, never merely by tabbing away.
    if (event.key === 'Tab') {
      close();
      return;
    }
    if (['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      opened ? choose(active) : open();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      opened ? highlight(active + 1) : open();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (opened && event.altKey) choose(active);
      else opened ? highlight(active - 1) : open();
    } else if (['Home', 'PageUp', 'End', 'PageDown'].includes(event.key)) {
      event.preventDefault();
      const index = ['Home', 'PageUp'].includes(event.key) ? 0 : options.length - 1;
      opened ? highlight(index) : open(index);
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      const normalize = (value: string) =>
        value
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase();
      const now = performance.now();
      search = (now - searchTime < 700 ? search : '') + normalize(event.key);
      searchTime = now;
      const prefix = [...search].every((character) => character === search[0]) ? search[0] : search;
      const ordered = options.map((_, index) => (active + 1 + index) % options.length);
      const match = ordered.find((index) =>
        normalize(options[index].dataset.label ?? '').startsWith(prefix),
      );
      if (!opened) open(match ?? selected);
      else if (match !== undefined) highlight(match);
    }
  });
  options.forEach((option, index) => {
    option.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'mouse') highlight(index);
    });
    option.addEventListener('click', () => choose(index));
  });
  document.addEventListener('pointerdown', (event) => {
    if (!root.contains(event.target as Node)) close();
  });
  root.addEventListener('focusout', (event) => {
    if (!root.contains(event.relatedTarget as Node | null)) close();
  });
  control.hidden = false;
  fallback.hidden = true;
}
