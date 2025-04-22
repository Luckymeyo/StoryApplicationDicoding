import { subscribePush } from './push-subscription.js';

const token = localStorage.getItem('token');
if (token) {
  subscribePush(token); // ← kirim token ke subscribePush
}

async function initPushNotification() {
  if (!('serviceWorker' in navigator)) {
    console.error('Service Worker not supported!');
    return;
  }

  const registration = await navigator.serviceWorker.ready;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.warn('Permission not granted');
    return;
  }

  try {
    const existingSub = await registration.pushManager.getSubscription();
    if (existingSub) {
      console.log('Already subscribed:', existingSub);
      return;
    }

    await subscribePush(token);
    console.log(' Push subscription complete and sent to backend.');
  } catch (err) {
    console.error(' Push subscription error:', err);
  }
}

export default initPushNotification;
