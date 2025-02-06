// app/api/contact/route.js

import { db } from "@/app/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

/**
 * POST /api/contact
 * Handles form submissions by storing data in Firestore.
 *
 * Expects JSON body:
 * {
 *   name: string,
 *   phone: string,
 *   email: string,
 *   message: string
 * }
 */
export async function POST(request) {
  try {
    // Parse the JSON body of the request
    const { name, phone, email, message } = await request.json();

    // Basic validation to ensure all fields are present
    if (!name || !phone || !email || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Reference to the 'contacts' collection in Firestore
    const contactsRef = collection(db, "contacts");

    // Add a new document with the form data and a timestamp
    await addDoc(contactsRef, {
      name,
      phone,
      email,
      message,
      createdAt: Timestamp.now(),
    });

    // Respond with a success message
    return new Response(
      JSON.stringify({ message: "Your message has been sent successfully!" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return new Response(
      JSON.stringify({
        error: "There was an error submitting your message. Please try again later.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}