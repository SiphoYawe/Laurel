/**
 * Service Worker for Push Notifications
 * Story 3-7: Habit Reminder Notifications
 */

/* eslint-disable no-undef, no-console, @typescript-eslint/no-unused-vars */

// Cache name for offline support
const CACHE_NAME = "laurel-v1";

// Install event - cache static assets
self.addEventListener("install", (_event) => {
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Push event - handle incoming push notifications
self.addEventListener("push", (event) => {
  let data = {
    title: "Laurel",
    body: "You have a notification",
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
    data: {},
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      console.error("[Service Worker] Error parsing push data:", e);
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || "/icon-192x192.png",
    badge: data.badge || "/badge-72x72.png",
    tag: data.tag || "default",
    data: data.data,
    actions: data.actions || [],
    requireInteraction: data.requireInteraction || false,
    vibrate: [200, 100, 200],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click event - handle user interaction
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const action = event.action;
  const data = event.notification.data || {};

  // Handle specific actions
  if (action === "snooze") {
    // Snooze action - reschedule notification for 30 minutes later
    var snoozeDelay = 30 * 60 * 1000; // 30 minutes in ms

    // Re-show notification after delay
    event.waitUntil(
      new Promise(function (resolve) {
        setTimeout(function () {
          self.registration
            .showNotification(event.notification.title, {
              body: event.notification.body,
              icon: event.notification.icon,
              badge: event.notification.badge,
              tag: event.notification.tag + "-snoozed",
              data: data,
              actions: event.notification.actions,
              requireInteraction: true,
            })
            .then(resolve);
        }, snoozeDelay);
      })
    );
    return;
  }

  if (action === "complete_now" || !action) {
    // Open the app to the habit page
    var deepLink = data.deepLink || "/";
    var urlToOpen = new URL(deepLink, self.location.origin).href;

    event.waitUntil(
      self.clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then(function (clientList) {
          // Check if app is already open
          for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if (client.url.includes(self.location.origin) && "focus" in client) {
              client.focus();
              client.postMessage({
                type: "NOTIFICATION_CLICK",
                data: data,
                deepLink: deepLink,
              });
              return;
            }
          }

          // Open new window if app not open
          if (self.clients.openWindow) {
            return self.clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Notification close event - track dismissals
self.addEventListener("notificationclose", function (_event) {
  // Could send analytics event here
  // In a real implementation, this would communicate with the server
});

// Message event - handle messages from main app
self.addEventListener("message", function (event) {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
