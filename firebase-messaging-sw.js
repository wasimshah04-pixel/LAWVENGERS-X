// Import and configure the Firebase SDK
// This is the "bare" SDK - no other services are included.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
    apiKey: "AIzaSyCGEhtOC5B8MyPffRmpyvBf0NlEJU1tvuY",
    authDomain: "lawvengers-x.firebaseapp.com",
    databaseURL: "https://lawvengers-x-default-rtdb.firebaseio.com",
    projectId: "lawvengers-x",
    storageBucket: "lawvengers-x.appspot.com",
    messagingSenderId: "136620412563",
    appId: "1:136620412563:web:7d211309140d5d1dacc766"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  
  // Customize the notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png' // Optional: Add an icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});