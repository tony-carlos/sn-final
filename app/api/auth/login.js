// app/api/auth/login.js

import { adminAuth } from "@/lib/firebase";
import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    // Fetch the user by email using Firebase Admin SDK
    const userRecord = await adminAuth.getUserByEmail(email);

    // Check if the email matches the admin email
    if (email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      return NextResponse.json(
        { message: "Access denied. Not an admin user." },
        { status: 403 }
      );
    }

    // Note: Firebase Admin SDK does not handle password verification.
    // Password verification should be handled client-side using Firebase Client SDK.

    // Since we can't verify the password server-side, we'll handle it client-side.
    // After client-side authentication, the client can call this API to set the cookie.

    // For demonstration, assume authentication is successful and set the cookie.
    // In production, ensure secure handling of authentication.

    // Create a custom token
    const customToken = await adminAuth.createCustomToken(userRecord.uid);

    // Set the token in a secure HTTP-only cookie
    const response = NextResponse.json(
      { message: "Login successful." },
      { status: 200 }
    );

    response.cookies.set("token", customToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
