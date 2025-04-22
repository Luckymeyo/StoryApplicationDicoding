const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  };
  
  const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';
  
  export async function subscribePush(apiToken) {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
  
    try {
      const sw = await navigator.serviceWorker.ready;
  
      const subscription = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
  
      console.log('✅ Subscription created:', subscription);
  
      const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`,
        },
        body: JSON.stringify(subscription.toJSON()),
      });
  
      const result = await response.json();
      console.log('📬 Dicoding Push API Response:', result);
    } catch (err) {
      console.error('❌ Failed to subscribe or send push subscription:', err);
    }
  }
  