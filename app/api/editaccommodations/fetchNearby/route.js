export const runtime = "edge"; // <-- Add this at the top

export const dynamic = "force-dynamic"; // Must be the first line

import { NextResponse } from "next/server";
import axios from "axios";
import { db } from "@/app/lib/firebase"; // Adjust if necessary
import { doc, getDoc } from "firebase/firestore";

/**
 * GET /api/accommodations/fetchNearby?destinationId=...
 * Fetches nearby accommodations based on a destination's coordinates using OpenStreetMap data.
 */
export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;
    const destinationId = searchParams.get("destinationId");

    if (!destinationId) {
      console.error("destinationId parameter is required.");
      return NextResponse.json(
        { error: "destinationId parameter is required." },
        { status: 400 }
      );
    }

    // Fetch destination details from Firestore to get coordinates
    const destinationRef = doc(db, "destinations", destinationId);
    const destinationSnap = await getDoc(destinationRef);

    if (!destinationSnap.exists()) {
      console.error(`Destination with ID ${destinationId} does not exist.`);
      return NextResponse.json(
        { error: "Destination does not exist." },
        { status: 404 }
      );
    }

    const destinationData = destinationSnap.data();
    const { lat, lng } = destinationData.coordinates || {};

    if (lat === undefined || lng === undefined) {
      console.error("Destination coordinates are missing.");
      return NextResponse.json(
        { error: "Destination coordinates are missing." },
        { status: 400 }
      );
    }

    // Define the OSM "tourism" values you're interested in
    // For example: hotel, motel, hostel, camp_site, resort, etc.
    const osmTourismValues = [
      "hotel",
      "hostel",
      "hut",
      "camping",
      "lodging",
      "guest_house",
      "apartment",
      "resort",
      "motel",
      "camp_site",
      "caravan_site",
      "alpine_hut",
      "wilderness_hut",
      "chalet",
      "bed_and_breakfast",
      "camp_pitch",
      "guest_room",
    ];

    // Overpass radius in meters
    const radius = 35000; // 35 km, adjust as needed

    // Construct the Overpass QL to fetch all relevant tourism POIs within a given radius
    // around the specified lat/lng. We combine multiple tourism values in one query.
    // nwr stands for nodes/ways/relations
    const tourismQueries = osmTourismValues
      .map((val) => `nwr["tourism"="${val}"](around:${radius},${lat},${lng});`)
      .join("\n      ");

    const overpassQuery = `
      [out:json];
      (
        ${tourismQueries}
      );
      out center;
    `;

    const overpassUrl = "https://overpass-api.de/api/interpreter";
    const response = await axios.post(overpassUrl, overpassQuery, {
      headers: { "Content-Type": "text/plain" },
    });

    if (!response.data || !response.data.elements) {
      console.warn(
        `No data returned from Overpass API for lat=${lat}, lng=${lng}`
      );
      return NextResponse.json({ accommodations: [] }, { status: 200 });
    }

    // Parse the Overpass elements into a consistent structure
    const accommodations = response.data.elements.map((element) => {
      const tags = element.tags || {};
      return {
        // OSM does not have a "placeId". We can return the OSM element ID instead:
        value: `${element.type}/${element.id}`, // e.g., node/123456789
        label: tags.name ? tags.name : "Unnamed Accommodation",
        address: tags["addr:full"] || buildAddress(tags),
        location: element.center
          ? { lat: element.center.lat, lng: element.center.lon }
          : element.type === "node"
          ? { lat: element.lat, lng: element.lon }
          : {},

        // OSM may or may not have some of these tags:
        website: tags.website || "",
        phoneNumber: tags.phone || "",
        // OSM does not store a standard rating system:
        rating: null,
        userRatingsTotal: 0,
        // Category is derived from the "tourism" tag:
        category: tags.tourism || "",
      };
    });

    return NextResponse.json({ accommodations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching nearby accommodations:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

/**
 * Build a simple address string from common OSM addr:* tags.
 */
function buildAddress(tags) {
  const houseNumber = tags["addr:housenumber"] || "";
  const street = tags["addr:street"] || "";
  const city = tags["addr:city"] || "";
  const postcode = tags["addr:postcode"] || "";
  const country = tags["addr:country"] || "";

  // Build a simple comma-separated address
  return [houseNumber, street, city, postcode, country]
    .filter(Boolean)
    .join(", ");
}
