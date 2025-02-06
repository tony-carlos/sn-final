// app/admin/api/users/route.js

import { adminAuth, adminFirestore } from "@/app/lib/firebaseAdmin";
import { NextResponse } from "next/server";
// The `parse` import from 'cookie' isn't used and can be removed
// import { parse } from 'cookie';

export async function GET(request) {
  try {
    // Fetch users from Firestore
    const usersSnapshot = await adminFirestore.collection("users").get();
    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Admin API Route Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
