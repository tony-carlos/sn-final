// app/api/sendNotifications/route.js
export const runtime = "edge"; // <-- Add this at the top

import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  try {
    const { tour, bookingData } = await request.json();

    // Replace with your Firebase Function URL
    const functionUrl = process.env.NEXT_PUBLIC_FIREBASE_FUNCTION_URL;

    if (!functionUrl) {
      return NextResponse.json(
        { error: "Function URL not configured." },
        { status: 500 }
      );
    }

    // Send POST request to Firebase Function
    const response = await axios.post(functionUrl, {
      tour,
      bookingData,
    });

    if (response.status !== 200) {
      throw new Error("Failed to send notifications.");
    }

    return NextResponse.json(
      { message: "Notifications sent successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending notifications:", error);
    return NextResponse.json(
      { error: "Failed to send notifications." },
      { status: 500 }
    );
  }
}
