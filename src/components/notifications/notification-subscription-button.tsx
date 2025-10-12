'use client';

import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { subscribeToPushNotifications } from "@/lib/push-notifications";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function NotificationSubscribeButton() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [currentEndpoint, setCurrentEndpoint] = useState<string | null>(null);

  // Query with the current browser's endpoint
  const { data: dbSubscription, refetch: refetchSubscription } =
    api.notifications.checkSubscription.useQuery(
      { endpoint: currentEndpoint ?? '' },
      {
        enabled: !!currentEndpoint, // Only run when we have an endpoint
        refetchOnMount: true,
      }
    );

  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setPermission(Notification.permission);
      void checkExistingSubscription();
    }
  }, []);

  const checkExistingSubscription = async () => {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const browserSubscription = await registration.pushManager.getSubscription();

        if (browserSubscription) {
          setCurrentEndpoint(browserSubscription.endpoint);

          // Will trigger the query with the endpoint
          // The query result will determine if we're subscribed
        } else {
          setCurrentEndpoint(null);
          setIsSubscribed(false);
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
      }
    }
  };

  // Update subscription status when DB query returns
  useEffect(() => {
    if (currentEndpoint && dbSubscription !== undefined) {
      setIsSubscribed(!!dbSubscription && Notification.permission === 'granted');
    }
  }, [dbSubscription, currentEndpoint]);

  const { mutateAsync: subscribeMutation } = api.notifications.subscribe.useMutation();

  const handleSubscribe = async () => {
    try {
      setLoading(true);

      const subscription = await subscribeToPushNotifications();

      await subscribeMutation({
        endpoint: subscription.endpoint,
        p256dh: arrayBufferToBase64(subscription.getKey("p256dh")!),
        auth: arrayBufferToBase64(subscription.getKey("auth")!),
      });

      setCurrentEndpoint(subscription.endpoint);
      await refetchSubscription();
      setIsSubscribed(true);
      setPermission("granted");
      toast.success("Notifications enabled successfully!");
    } catch (error) {
      console.error("Failed to subscribe:", error);

      if (
        typeof Notification !== "undefined" &&
        Notification.permission === "denied"
      ) {
        toast.error(
          "Notifications blocked. Please enable them in your browser settings.",
        );
      } else {
        toast.error("Failed to enable notifications. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Rest of the component stays the same...
  if (isSubscribed && permission === 'granted') {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2 dark:border-green-800 dark:bg-green-950">
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        <span className="text-sm font-medium text-green-700 dark:text-green-300">
          Notifications Enabled
        </span>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 dark:border-amber-800 dark:bg-amber-950">
        <BellOff className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
          Notifications Blocked
        </span>
      </div>
    );
  }

  return (
    <Button size="sm" onClick={handleSubscribe} disabled={loading}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Enabling...
        </>
      ) : (
        <>
          <Bell className="mr-2 h-4 w-4" />
          Enable Notifications
        </>
      )}
    </Button>
  );
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}
