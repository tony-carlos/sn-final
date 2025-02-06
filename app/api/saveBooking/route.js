// app/api/saveBooking/route.js

import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(request) {
  try {
    const bookingData = await request.json();

    // Validate required fields
    const {
      tourId,
      tourTitle,
      fullName,
      email,
      phoneNumber,
      adults,
      youths,
      children,
      message,
      startDate,
      endDate,
      totalPrice,
    } = bookingData;

    if (
      !tourId ||
      !tourTitle ||
      !fullName ||
      !email ||
      !phoneNumber ||
      !startDate ||
      !endDate ||
      !totalPrice ||
      (adults < 1 && youths < 1)
    ) {
      return NextResponse.json(
        { error: "Missing required booking fields." },
        { status: 400 }
      );
    }

    // Add booking to Firestore
    const docRef = await addDoc(collection(db, "bookings"), {
      tourId,
      tourTitle,
      fullName,
      email,
      phoneNumber,
      adults,
      youths,
      children,
      message,
      startDate,
      endDate,
      totalPrice,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json(
      { message: "Booking saved successfully.", id: docRef.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving booking:", error);
    return NextResponse.json(
      { error: "Failed to save booking." },
      { status: 500 }
    );
  }
}
