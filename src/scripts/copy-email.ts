const button = document.querySelector<HTMLButtonElement>('.copy-email');
const copyStatus = document.querySelector<HTMLElement>('#copy-status');

if (button && copyStatus && typeof navigator.clipboard?.writeText === 'function') {
  button.hidden = false;
  button.addEventListener('click', async () => {
    const { email, success, error } = button.dataset;
    if (!email || !success || !error) return;
    copyStatus.textContent = '';
    try {
      await navigator.clipboard.writeText(email);
      copyStatus.textContent = success;
    } catch {
      copyStatus.textContent = error;
    }
  });
}
export {};
