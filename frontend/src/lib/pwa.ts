/**
 * PWA helpers: register service worker + browser Notification API for late alerts.
 */

export async function registerPWA(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;

  try {
    // vite-plugin-pwa virtual module (available after build / with plugin)
    const { registerSW } = await import('virtual:pwa-register');
    registerSW({
      immediate: true,
      onNeedRefresh() {
        // Auto-update strategy already set; optional UX hook
        console.info('[PWA] New content available, will update.');
      },
      onOfflineReady() {
        console.info('[PWA] App ready to work offline.');
      },
    });
  } catch (err) {
    // In pure dev without PWA plugin virtual module
    console.debug('[PWA] register skipped:', err);
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  if (Notification.permission === 'granted' || Notification.permission === 'denied') {
    return Notification.permission;
  }
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

export function showBrowserNotification(title: string, options?: NotificationOptions): void {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  try {
    const n = new Notification(title, {
      icon: '/pwa-192.png',
      badge: '/favicon.png',
      ...options,
    });
    n.onclick = () => {
      window.focus();
      n.close();
    };
  } catch (e) {
    console.debug('[PWA] notification failed', e);
  }
}
