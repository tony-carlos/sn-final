// app/components/AccommodationsList.js

"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";

/**
 * Component to display a list of all accommodations with edit links.
 */
const AccommodationsList = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await axios.get("/api/editaccommodations/list");
        setAccommodations(response.data.accommodations);
      } catch (error) {
        console.error("Error fetching accommodations:", error);
        toast.error("Failed to fetch accommodations.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, []);

  if (loading) {
    return <p>Loading accommodations...</p>;
  }

  if (accommodations.length === 0) {
    return <p>No accommodations found.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Accommodations</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Destination</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {accommodations.map((acc) => (
            <tr key={acc.slug}>
              <td className="py-2 px-4 border-b">{acc.name}</td>
              <td className="py-2 px-4 border-b">{acc.title}</td>
              <td className="py-2 px-4 border-b">{acc.status}</td>
              <td className="py-2 px-4 border-b">
                <Link href={`/accommodations/edit/${acc.slug}`}>
                  <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                    Edit
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccommodationsList;
