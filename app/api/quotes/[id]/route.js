// app/api/quotes/[id]/route.js
export const runtime = "edge"; // <-- Add this at the top

import { db } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const quoteRef = doc(db, "quotes", id);
    const quoteSnap = await getDoc(quoteRef);
    if (!quoteSnap.exists()) {
      return new Response(JSON.stringify({ message: "Quote not found" }), {
        status: 404,
      });
    }

    const quote = quoteSnap.data();
    return new Response(JSON.stringify(quote), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching quote:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      { status: 500 }
    );
  }
}