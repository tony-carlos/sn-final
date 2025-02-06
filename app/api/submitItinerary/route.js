// app/api/submitItinerary/route.js

import { NextResponse } from 'next/server';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import twilio from 'twilio';

export async function POST(request) {
  try {
    const {
      adult,
      child,
      dateVal,
      tripType,
      duration,
      budget,
      additionalInfo,
      fullName,
      email,
      country,
      dialCode,
      phone,
    } = await request.json();

    // Validate required fields
    if (
      adult === undefined ||
      child === undefined ||
      !dateVal ||
      !tripType ||
      !duration ||
      !budget ||
      !fullName ||
      !email ||
      !country ||
      !dialCode ||
      !phone
    ) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Combine dial code + phone number
    const fullPhone = `${dialCode}${phone}`;

    const payload = {
      adult,
      child,
      dateVal,
      tripType,
      duration,
      budget,
      additionalInfo,
      fullName,
      email,
      country,
      phone: fullPhone,
      createdAt: new Date().toISOString(),
    };

    // Save to Firebase Firestore
    const docRef = await addDoc(collection(db, 'customizedrequest'), payload);

    // Initialize Twilio Client
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    // Prepare Content Variables for the template
    const contentVariables = {
      "1": fullName || 'N/A',
      "2": email || 'N/A',
      "3": fullPhone || 'N/A',
      "4": adult || '0',
      "5": child || '0',
      "6": dateVal || 'N/A',
      "7": tripType || 'N/A',
      "8": duration || 'N/A',
      "9": budget || '0',
      "10": additionalInfo || 'N/A',
      "11": country || 'N/A',
    };

    // Send WhatsApp Message via Twilio
    const twilioResponse = await client.messages.create({
      contentSid: process.env.TWILIO_CONTENT_SID, // Your WhatsApp template SID
      from: process.env.TWILIO_WHATSAPP_FROM, // Your Twilio WhatsApp number
      to: 'whatsapp:+255759964985', // Recipient's WhatsApp number
      contentVariables: contentVariables,
    });

    console.log(`WhatsApp message sent: SID ${twilioResponse.sid}`);

    return NextResponse.json(
      { message: 'Itinerary submitted and WhatsApp message sent successfully', id: docRef.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
