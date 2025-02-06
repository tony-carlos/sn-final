// pages/api/destinations.js

import { db } from "@/app/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const destinationsCol = collection(db, "destinations");
      const destinationsSnapshot = await getDocs(destinationsCol);
      const destinationsList = destinationsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.status(200).json({ destinations: destinationsList });
    } catch (error) {
      console.error("Error fetching destinations:", error);
      res.status(500).json({ error: "Failed to fetch destinations." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
