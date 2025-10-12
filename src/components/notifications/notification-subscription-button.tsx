// components/NotificationSubscribeButton.tsx
'use client';

import { useState } from 'react';
import { api } from '@/trpc/react';
import { subscribeToPushNotifications } from '@/lib/push-notifications';

export function NotificationSubscribeButton() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  // const subscribeMutation = trpc.notifications.subscribe.useMutation();

  const { mutateAsync: subscribeMutation } = api.notifications.subscribe.useMutation();

  const handleSubscribe = async () => {
    try {
      setLoading(true);

      // Get push subscription from browser
      const subscription = await subscribeToPushNotifications();

      // Send to server
      await subscribeMutation({
        endpoint: subscription.endpoint,
        p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
        auth: arrayBufferToBase64(subscription.getKey('auth')!),
      });

      setIsSubscribed(true);
      alert('Notifications enabled!');
    } catch (error) {
      console.error('Failed to subscribe:', error);
      alert('Failed to enable notifications');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading || isSubscribed}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      {loading ? 'Subscribing...' : isSubscribed ? 'Notifications Enabled' : 'Enable Notifications'}
    </button>
  );
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}