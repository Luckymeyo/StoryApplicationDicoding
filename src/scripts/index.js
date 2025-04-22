import '../styles/style.css';
import { initRouter } from './router';
import 'leaflet/dist/leaflet.css';
import initPushNotification from './push-notification-init.js';
import { subscribePush } from './push-subscription';


document.addEventListener('DOMContentLoaded', () => {
  initPushNotification(); // ← ini harus dipanggil!
  initRouter();

  // Skip link
  const skipLink = document.querySelector('.skip-link');
  skipLink.addEventListener('click', (e) => {
    const target = document.getElementById('#');
    if (target) {
      e.preventDefault();
      target.setAttribute('tabindex', '-1');
      target.focus();
    }
  });

  // View Transition Hook
  setupViewTransitionNavigation();
});

function setupViewTransitionNavigation() {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetHref = link.getAttribute('href');

      if (!targetHref.startsWith('#')) return;

      const destination = targetHref.slice(1);
      const container = document.getElementById('app');

      if (!container || !document.startViewTransition) return;

      e.preventDefault();

      document.startViewTransition(async () => {
        // Simulasikan penggantian konten
        window.location.hash = destination;
        // Biarkan router handle penggantian halaman
        await initRouter();
      });
    });
  });
}

// Fungsi tambahan
export function showFormattedDate(date, locale = 'en-US', options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
