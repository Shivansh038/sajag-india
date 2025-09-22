self.addEventListener('push', (event) => {
  const data = event.data.json();
  const title = data.title || 'Sajag Alert';
  const options = {
    body: data.body || 'New real-time alert received.',
    icon: '/favicon.ico',
    badge: '/favicon.ico'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.openWindow('/')
  );
});