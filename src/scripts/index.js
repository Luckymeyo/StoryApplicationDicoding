// src/scripts/index.js

import '../styles/style.css';
import { initRouter } from './router';
import 'leaflet/dist/leaflet.css';
import initPushNotification from './push-notification-init.js';
import { subscribePush } from './push-subscription';

document.addEventListener('DOMContentLoaded', async () => {
  // Register your service worker (inside initPushNotification)
  initPushNotification();

  // Request Notification Permission
  if ('Notification' in window && 'serviceWorker' in navigator) {
    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);

    if (permission === 'granted') {
      // Grab your saved API token
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Pass only the token—subscribePush will handle navigator.serviceWorker.ready internally
          const registration = await navigator.serviceWorker.ready;
          await subscribePush(registration, token);
          console.log('✅ Push subscribed and sent to server.');
        } catch (err) {
          console.error('❌ Failed to subscribe push:', err);
        }
      }
    }
  }

  // Initialize your SPA router
  initRouter();

  // Skip link accessibility
  const skipLink = document.querySelector('.skip-link');
  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    const main = document.getElementById('app');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus();
    }
  });

  // Set up view-transition for in-app navigation
  setupViewTransitionNavigation();
});

function setupViewTransitionNavigation() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener('click', async (e) => {
      const href = link.getAttribute('href');
      if (!href.startsWith('#') || !document.startViewTransition) return;

      e.preventDefault();
      await document.startViewTransition(async () => {
        window.location.hash = href.slice(1);
        await initRouter();
      });
    });
  });
}

// Utility exports
export function showFormattedDate(date, locale = 'en-US', options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year:   'numeric',
    month:  'long',
    day:    'numeric',
    ...options,
  });
}

export function sleep(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
