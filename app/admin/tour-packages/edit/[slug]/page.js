// /app/admin/tour-packages/edit/[slug]/page.js

'use client'; // Ensure this is a client component
export const runtime = "edge"; // <-- Add this at the top

import React, { useEffect, useState } from "react";
import TourPackageForm from "../../create/components/TourPackageForm";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useParams } from "next/navigation"; // Import useParams

/**
 * EditTourPackagePage Component
 *
 * Fetches existing tour package data by slug and renders the TourPackageForm in edit mode.
 */
const EditTourPackagePage = () => {
  const router = useRouter();
  const params = useParams(); // Access route parameters using useParams
  const { slug } = params; // Destructure slug from params
  const [existingData, setExistingData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        // Fetch the package data based on the slug
        const response = await axios.get(`/api/tour-packages/${slug}`);
        if (response.status === 200) {
          setExistingData(response.data.tourPackage);
        } else {
          toast.error("Failed to fetch tour package data.");
          router.push("/admin/tour-packages");
        }
      } catch (error) {
        console.error("Error fetching tour package:", error);
        toast.error("Failed to fetch tour package data.");
        router.push("/admin/tour-packages");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchExistingData();
    }
  }, [slug, router]);

  if (loading) {
    return <p>Loading...</p>; // Or a spinner component
  }

  if (error) {
    return <p>Error loading tour package.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Edit Tour Package</h1>
      <TourPackageForm existingData={existingData} isEdit={true} />
    </div>
  );
};

export default EditTourPackagePage;
