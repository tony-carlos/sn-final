export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get("placeId");

    if (!placeId) {
      return NextResponse.json(
        { error: "placeId parameter is required." },
        { status: 400 }
      );
    }

    // 1. Parse OSM element type and ID from the placeId string (e.g., "node/123456")
    //    Split by "/" to separate 'node' or 'way' or 'relation' from the numeric ID.
    const [osmType, osmId] = placeId.split("/");
    if (!osmType || !osmId) {
      return NextResponse.json(
        {
          error:
            "Invalid placeId format. Expected 'node/12345', 'way/12345', or 'relation/12345'.",
        },
        { status: 400 }
      );
    }

    // 2. Construct an Overpass QL query to fetch this single element
    //    We’ll request JSON output. Note that for ways and relations, you might want `out center;`
    //    to get a lat/lon. For a node, you just get lat/lon by default with `out;`.
    //    Here, we’ll branch logic for node vs. way vs. relation.
    let overpassQuery;
    if (osmType === "node") {
      // Node
      overpassQuery = `
        [out:json];
        node(${osmId});
        out;
      `;
    } else if (osmType === "way") {
      // Way
      overpassQuery = `
        [out:json];
        way(${osmId});
        out center;
      `;
    } else if (osmType === "relation") {
      // Relation
      overpassQuery = `
        [out:json];
        relation(${osmId});
        out center;
      `;
    } else {
      return NextResponse.json(
        { error: `Unsupported OSM element type: ${osmType}` },
        { status: 400 }
      );
    }

    // 3. Send request to Overpass API
    const overpassUrl = "https://overpass-api.de/api/interpreter";
    const response = await axios.post(overpassUrl, overpassQuery, {
      headers: { "Content-Type": "text/plain" },
    });

    // 4. Validate response
    if (
      !response.data ||
      !response.data.elements ||
      response.data.elements.length === 0
    ) {
      return NextResponse.json(
        { error: "No OSM data found for the specified ID." },
        { status: 404 }
      );
    }

    // We expect exactly one element
    const element = response.data.elements[0];
    const tags = element.tags || {};

    // 5. Extract relevant data
    // OSM does not store rating, price level, or standardized photos like Google.
    // Here, we simply return what might be available. Adjust fields as needed.
    const placeDetails = {
      osmType,
      osmId,
      name: tags.name || "Unnamed",
      website: tags.website || "",
      // phone might be in multiple tag forms: phone, contact:phone, etc.
      formatted_phone_number: tags.phone || tags["contact:phone"] || "",
      formatted_address: buildAddress(tags),
      // For ways/relations, the lat/lon is under element.center.
      // For nodes, lat/lon is top-level
      location:
        osmType === "node"
          ? { lat: element.lat, lng: element.lon }
          : element.center
          ? { lat: element.center.lat, lng: element.center.lon }
          : {},
      types: tags.tourism ? [tags.tourism] : [],
      // rating, price_level, photos are typically missing in OSM
      rating: null,
      price_level: null,
      photos: [],
    };

    return NextResponse.json({ placeDetails }, { status: 200 });
  } catch (error) {
    console.error("Error fetching OSM place details:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

/**
 * Attempt to build a human-readable address from common OSM addr:* tags.
 */
function buildAddress(tags) {
  const houseNumber = tags["addr:housenumber"] || "";
  const street = tags["addr:street"] || "";
  const city = tags["addr:city"] || "";
  const postcode = tags["addr:postcode"] || "";
  const country = tags["addr:country"] || "";

  const parts = [houseNumber, street, city, postcode, country].filter(Boolean);
  return parts.join(", ");
}
