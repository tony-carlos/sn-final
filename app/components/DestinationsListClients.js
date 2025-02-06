'use client';

import React, { useEffect, useState } from 'react';
import { db } from "@/app/lib/firebase";
import { collection, query, getDocs } from "firebase/firestore";
import { transformDestination } from "@/app/lib/transformData";

export default function DestinationsListClients() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const destinationsRef = collection(db, "destinations");
        const q = query(destinationsRef);
        const querySnapshot = await getDocs(q);
        const dests = [];

        querySnapshot.forEach((doc) => {
          dests.push(transformDestination(doc));
        });

        setDestinations(dests);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching destinations:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {destinations.map((destination) => (
        <div key={destination.id} className="border p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">{destination.name}</h2>
          <p className="text-gray-600">{destination.description}</p>
        </div>
      ))}
    </div>
  );
}
