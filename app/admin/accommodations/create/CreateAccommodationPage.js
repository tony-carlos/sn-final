// app/admin/accommodations/create/page.js

"use client";

import React from "react";
import AccommodationForm from "../components/AccommodationForm";
import { useRouter } from "next/navigation";

const CreateAccommodationPage = () => {
  const router = useRouter();

  const handleSuccess = () => {
    // Redirect to accommodations list after successful creation
    router.push("/admin/accommodations");
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Create New Accommodation</h2>
      <AccommodationForm onSuccess={handleSuccess} isEditMode={false} />
    </div>
  );
};

export default CreateAccommodationPage;
