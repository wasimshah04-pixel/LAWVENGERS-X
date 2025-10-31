const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendNoticeNotification = functions.database
  .ref("/notices/{noticeId}")
  .onCreate(async (snapshot, context) => {
    // Get the new notice data
    const noticeData = snapshot.val();
    const title = noticeData.title;
    const content = noticeData.content.substring(0, 100) + "..."; // First 100 chars

    // Create the notification payload
    const payload = {
      notification: {
        title: `New Notice: ${title}`,
        body: content,
        // Optional: click_action can open the app
        click_action: "https://your-app-url.com", // Replace with your app URL
      },
    };

    // Get all user FCM tokens from the database
    const tokensSnapshot = await admin.database().ref("/fcm_tokens").once("value");
    if (!tokensSnapshot.exists()) {
      console.log("No FCM tokens found.");
      return null;
    }

    const tokens = Object.values(tokensSnapshot.val());

    // Send notifications to all tokens
    const response = await admin.messaging().sendToDevice(tokens, payload);
    console.log("Successfully sent message:", response);

    // Optional: Clean up invalid tokens
    const tokensToRemove = [];
    response.results.forEach((result, index) => {
      const error = result.error;
      if (error) {
        console.error(
          "Failure sending notification to",
          tokens[index],
          error
        );
        if (
          error.code === "messaging/invalid-registration-token" ||
          error.code === "messaging/registration-token-not-registered"
        ) {
          const invalidTokenKey = Object.keys(tokensSnapshot.val())[index];
          tokensToRemove.push(
            admin.database().ref(`/fcm_tokens/${invalidTokenKey}`).remove()
          );
        }
      }
    });

    return Promise.all(tokensToRemove);
  });
// Trying again & again
