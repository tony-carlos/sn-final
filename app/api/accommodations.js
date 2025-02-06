// pages/api/accommodations.js

import { db } from "@/app/lib/firebase";
import { collection, getDocs, query, where, doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";

export default async function handler(req, res) {
  const { action, destinationId, slug } = req.query;

  if (req.method === "GET") {
    if (action === "nearby") {
      // Fetch accommodations based on destinationId
      try {
        const accommodationsCol = collection(db, "accommodations");
        const q = query(accommodationsCol, where("destinationId", "==", destinationId));
        const accommodationsSnapshot = await getDocs(q);
        const accommodationsList = accommodationsSnapshot.docs.map((doc) => ({
          placeId: doc.id,
          ...doc.data(),
        }));
        res.status(200).json({ accommodations: accommodationsList });
      } catch (error) {
        console.error("Error fetching accommodations:", error);
        res.status(500).json({ error: "Failed to fetch accommodations." });
      }
    } else if (action === "checkSlug") {
      // Check if a slug already exists
      try {
        const accommodationDoc = doc(db, "accommodations", slug);
        const accommodationSnap = await getDoc(accommodationDoc);
        res.status(200).json({ exists: accommodationSnap.exists() });
      } catch (error) {
        console.error("Error checking slug:", error);
        res.status(500).json({ error: "Failed to check slug." });
      }
    } else {
      res.status(400).json({ error: "Invalid action." });
    }
  } else if (req.method === "PUT") {
    // Update accommodation
    try {
      const { slug } = req.query;
      const accommodationDoc = doc(db, "accommodations", slug);
      const data = req.body;

      await updateDoc(accommodationDoc, data);
      res.status(200).json({ message: "Accommodation updated successfully." });
    } catch (error) {
      console.error("Error updating accommodation:", error);
      res.status(500).json({ error: "Failed to update accommodation." });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
