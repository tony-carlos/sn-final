// /app/admin/tour-packages/view/[id]/page.js

"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";

const ViewTourPackagePage = () => {
  const { id } = useParams();
  const [tourData, setTourData] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch tour package data.
   */
  const fetchTourData = async () => {
    try {
      const response = await axios.get(`/api/tour-packages/${id}`);
      if (response.status === 200) {
        setTourData(response.data.tourPackage);
      } else {
        toast.error("Tour package not found.");
      }
    } catch (error) {
      console.error("Error fetching tour package:", error);
      toast.error("Failed to fetch tour package.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTourData();
    } else {
      toast.error("Invalid tour package ID.");
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  if (!tourData) {
    return <p className="p-6">Tour package not found.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{tourData.basicInfo.tourTitle}</h1>
      {tourData.images && tourData.images.length > 0 && (
        <div className="mb-4">
          <Image
            src={tourData.images[0].url}
            alt={tourData.basicInfo.tourTitle}
            width={600}
            height={400}
            className="rounded-md"
          />
        </div>
      )}
      <p className="mb-4">{tourData.basicInfo.description}</p>

      {/* Display Additional Details as Needed */}
      <div className="space-y-4">
        {/* Destination Country */}
        <div>
          <h2 className="text-xl font-semibold">Destination Country</h2>
          <p>{tourData.basicInfo.country?.label || "N/A"}</p>
        </div>

        {/* Status */}
        <div>
          <h2 className="text-xl font-semibold">Status</h2>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              tourData.basicInfo.status === "Published"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {tourData.basicInfo.status}
          </span>
        </div>

        {/* Itinerary */}
        <div>
          <h2 className="text-xl font-semibold">Itinerary</h2>
          {tourData.itinerary && tourData.itinerary.length > 0 ? (
            <ul className="list-disc list-inside">
              {tourData.itinerary.map((item, idx) => (
                <li key={idx}>
                  <strong>{item.title}:</strong> {item.description}
                </li>
              ))}
            </ul>
          ) : (
            <p>No itinerary details available.</p>
          )}
        </div>

       

        {/* SEO Information */}
        <div>
          <h2 className="text-xl font-semibold">SEO Information</h2>
          <p>
            <strong>SEO Title (EN):</strong> {tourData.seo.seoTitle_en}
          </p>
          <p>
            <strong>SEO Description (EN):</strong> {tourData.seo.seoDescription_en}
          </p>
          {/* Add more SEO fields as needed */}
        </div>
      </div>
    </div>
  );
};

export default ViewTourPackagePage;
