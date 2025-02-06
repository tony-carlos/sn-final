// pages/api/editiaccommodations/[slug].js

import { db } from "@/app/lib/firebase"; // Adjust the path as necessary
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

export default async function handler(req, res) {
  const {
    query: { slug },
    method,
    body,
  } = req;

  const accommodationsRef = collection(db, "accommodations");

  // Function to find accommodation by slug
  const findAccommodationBySlug = async (slugToFind) => {
    const q = query(accommodationsRef, where("slug", "==", slugToFind));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    // Assuming slugs are unique, return the first match
    const docData = querySnapshot.docs[0];
    return { id: docData.id, ...docData.data() };
  };

  switch (method) {
    case "GET":
      try {
        const accommodation = await findAccommodationBySlug(slug);
        if (!accommodation) {
          return res.status(404).json({ error: "Accommodation not found." });
        }
        return res.status(200).json({ accommodation });
      } catch (error) {
        console.error("Error fetching accommodation:", error);
        return res.status(500).json({ error: "Internal Server Error." });
      }

    case "PUT":
      try {
        const existingAccommodation = await findAccommodationBySlug(slug);
        if (!existingAccommodation) {
          return res.status(404).json({ error: "Accommodation not found." });
        }

        const { slug: newSlug, ...otherData } = body;

        // If the slug is being updated, check for uniqueness
        if (newSlug && newSlug !== slug) {
          const slugExists = await findAccommodationBySlug(newSlug);
          if (slugExists) {
            return res
              .status(400)
              .json({ error: "Another accommodation with this slug already exists." });
          }
        }

        // Reference to the specific accommodation document
        const accommodationDocRef = doc(db, "accommodations", existingAccommodation.id);

        // Update the accommodation document
        await updateDoc(accommodationDocRef, {
          ...otherData,
          slug: newSlug, // Update slug if it has changed
          updatedAt: new Date().toISOString(),
        });

        return res.status(200).json({ message: "Accommodation updated successfully." });
      } catch (error) {
        console.error("Error updating accommodation:", error);
        return res.status(500).json({ error: "Internal Server Error." });
      }

    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
