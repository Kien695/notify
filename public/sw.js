self.addEventListener("push", (event) => {
  console.log("=== PUSH RECEIVED ===");

  if (!event.data) {
    console.log("No payload");
    return;
  }

  const payload = event.data.json();
  console.log(payload);

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      data: {
        url: payload.url,
      },
    }),
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
