// app/api/seo/[slug]/route.js
export const dynamic = 'force-dynamic'; 

import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

/**
 * Handler for GET requests to /api/seo/[slug]
 */
export async function GET(request, { params }) {
  const { slug } = params;

  if (!slug) {
    return new Response(JSON.stringify({ message: "Slug is required." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const toursRef = collection(db, "tourPackages");
    const q = query(toursRef, where("basicInfo.slug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return new Response(JSON.stringify({ message: "Tour not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();

    const seo = data.seo || {};

    return new Response(JSON.stringify(seo), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching SEO data:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
