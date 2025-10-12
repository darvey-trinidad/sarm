// lib/push-service.ts
import webpush from 'web-push';
import { db, eq } from '@/server/db';
import { pushSubscriptions } from '@/server/db/schema/auth';

// Configure web-push
webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

interface SendNotificationParams {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  actions?: Array<{ action: string; title: string; icon?: string }>;
}

export async function sendPushNotification({
  userId,
  title,
  body,
  data = {},
  actions = [],
}: SendNotificationParams) {
  // Get all subscriptions for this user
  const subscriptions = await db.select().from(pushSubscriptions).where(eq(pushSubscriptions.userId, userId));

  if (subscriptions.length === 0) {
    console.log('No push subscriptions found for user:', userId);
    return;
  }

  const payload = JSON.stringify({
    title,
    body,
    icon: '/icon.png',
    badge: '/badge.png',
    data,
    actions,
    tag: data.requestId || `notification-${Date.now()}`,
  });

  // Send to all subscriptions
  const promises = subscriptions.map(async (subscription) => {
    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth,
          },
        },
        payload
      );
      console.log('Notification sent successfully to:', subscription.endpoint);
    } catch (error: any) {
      console.error('Error sending notification:', error);

      // If subscription is invalid, remove it
      if (error.statusCode === 410 || error.statusCode === 404) {
        await db
          .delete(pushSubscriptions)
          .where(eq(pushSubscriptions.id, subscription.id));
        console.log('Removed invalid subscription');
      }
    }
  });

  await Promise.allSettled(promises);
}