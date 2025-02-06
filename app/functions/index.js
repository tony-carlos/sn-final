// functions/index.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const twilio = require('twilio');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Retrieve Twilio credentials from environment variables
const accountSid = functions.config().twilio.sid;
const authToken = functions.config().twilio.token;
const whatsappFrom = functions.config().twilio.whatsapp_from;

// Initialize Twilio client
const client = twilio(accountSid, authToken);

/**
 * Cloud Function to send WhatsApp message upon new Firestore document creation.
 */
exports.sendWhatsAppMessage = functions.firestore
  .document('customizedrequest/{docId}')
  .onCreate(async (snap, context) => {
    // Extract data from the new document
    const data = snap.data();

    // Define the recipient's WhatsApp number
    const whatsappTo = 'whatsapp:+255759964985'; // Ensure '+' and country code

    // Prepare Content Variables based on your Twilio template
    // Adjust the keys ("1", "2", etc.) to match your template placeholders
    const contentVariables = {
      "1": data.fullName || 'N/A',
      "2": data.email || 'N/A',
      "3": data.phone || 'N/A',
      "4": data.country || 'N/A',
      "5": data.tripType || 'N/A',
      "6": data.duration || 'N/A',
      "7": data.adult || '0',
      "8": data.child || '0',
      "9": data.budget || '0',
      "10": data.dateVal || 'N/A',
      "11": data.additionalInfo || 'N/A',
      "12": data.createdAt ? new Date(data.createdAt).toLocaleString() : 'N/A'
    };

    try {
      // Send the WhatsApp message via Twilio using ContentSid and ContentVariables
      const messageInstance = await client.messages.create({
        contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e', // Your Content SID
        from: whatsappFrom, // Twilio WhatsApp number
        to: whatsappTo, // Recipient's WhatsApp number
        contentVariables: contentVariables
      });

      console.log(`WhatsApp message sent: SID ${messageInstance.sid}`);
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      // Optional: Implement retry logic or alerting mechanisms here
    }
  });
