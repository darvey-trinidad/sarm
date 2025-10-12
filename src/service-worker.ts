// src/service-worker.ts

// Type definitions for service worker
declare const self: ServiceWorkerGlobalScope;

interface NotificationData {
  requestId: string;
  type: string;
}

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data: NotificationData;
  actions?: Array<{ action: string; title: string; icon?: string }>;
  tag?: string;
}

interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

// Force immediate activation of new service worker
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event: PushEvent) => {
  if (!event.data) return;

  const payload: NotificationPayload = event.data.json();

  const options: NotificationOptions & { actions?: NotificationAction[] } = {
    body: payload.body,
    icon: payload.icon || '/icon.png',
    badge: payload.badge || '/badge.png',
    data: payload.data,
    actions: payload.actions,
    tag: payload.tag,
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();

  const data = event.notification.data as NotificationData;
  const action = event.action;

  if (action === 'accept' || action === 'decline') {
    event.waitUntil(
      fetch('/api/respond-to-room-request', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomRequestId: data.requestId,
          status: action
        })
      })
        .then(response => response.json())
        .then(() => {
          return self.registration.showNotification(
            action === 'accept' ? 'Request Accepted' : 'Request Declined',
            {
              body: `You ${action}ed the classroom borrowing request`,
              icon: '/icon.png'
            }
          );
        })
        .catch(() => {
          return self.registration.showNotification('Error', {
            body: 'Failed to process request. Please try again in the app.',
            icon: '/icon.png'
          });
        })
    );
  } else {
    event.waitUntil(
      self.clients.openWindow(`/requests/${data.requestId}`)
    );
  }
});

// TypeScript needs this to treat the file as a module
export { };