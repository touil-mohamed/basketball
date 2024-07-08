export async function enableNotifications() {
  console.log("Requesting notification permission...");
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      console.log("No existing subscription, subscribing user...");
      await subscribeUserToPush(registration);
    } else {
      console.log("User is already subscribed.");
    }
  } else {
    console.log("Notification permission denied.");
  }
}

async function subscribeUserToPush(registration) {
  try {
    console.log("Fetching VAPID key...");
    const response = await fetch("http://localhost:3000/push/key");
    if (!response.ok) {
      throw new Error("Failed to fetch VAPID key");
    }

    const keys = await response.json();
    console.log("VAPID key fetched:", keys);
    const applicationServerKey = urlBase64ToUint8Array(keys.pubkey);
    console.log("Subscribing to push notifications...");

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    });
    console.log("Subscription successful:", subscription);

    const subResponse = await fetch("http://localhost:3000/push/sub", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!subResponse.ok) {
      throw new Error("Failed to subscribe for push notifications");
    }
    console.log("Subscription sent to server successfully.");
  } catch (error) {
    console.error("Error during push subscription:", error);
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
