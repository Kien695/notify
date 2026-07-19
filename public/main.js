function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function configurePushNotification() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return;
  }

  // Đăng ký
  await navigator.serviceWorker.register("/sw.js");

  // Đợi service worker active
  const registration = await navigator.serviceWorker.ready;

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    alert("Bạn đã từ chối quyền thông báo!");
    return;
  }

  const publicVapidKey =
    "BHEurhBXCV4XMFIxjeRbuJThf8tKIAdTo9wjk1WDkWgh6U8f2OvouO7AgG1umNxYhVBEO9PfywT0O3kSTWYKBuc";

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });

  await fetch("/api/save-subscription", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });

  alert("Đăng ký nhận thông báo thành công!");
}

// Hàm gọi API bắt server gửi ngược thông báo về máy
async function triggerNotification() {
  await fetch("/api/trigger-push", { method: "POST" });
}
