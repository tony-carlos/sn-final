// app/admin/accommodations/[slug]/edit/page.js

"use client";

import React from "react";
import EditAccommodationForm from "@/app/components/EditAccommodationForm";
import { useParams } from "next/navigation";

const EditAccommodationPage = () => {
  const params = useParams();
  const { slug } = params; // Extract slug from URL parameters

  if (!slug) {
    return (
        <div className="p-6">
          <p className="text-red-500">Invalid accommodation slug.</p>
        </div>
    );
  }

  return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Accommodation</h1>
        <EditAccommodationForm
          slug={slug}
          onSuccess={() => {
            // Optional: Handle post-success actions, e.g., redirect or refresh
          }}
        />
      </div>
  );
};

export default EditAccommodationPage;
