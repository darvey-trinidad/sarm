import { env } from "@/env";

// lib/push-notifications.ts
export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service workers not supported');
  }

  const registration = await navigator.serviceWorker.register('/sw.js');
  return registration;
}

export async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();

  if (permission !== 'granted') {
    throw new Error('Notification permission denied');
  }

  return permission;
}

export async function subscribeToPushNotifications() {
  // Register service worker
  const registration = await registerServiceWorker();

  // Request permission
  await requestNotificationPermission();

  // Subscribe to push notifications
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    ),
  });

  return subscription;
}

// Helper function
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}