// app/admin/accommodations/create/CreateAccommodationClient.js

"use client";

import React from "react";
import AccommodationForm from "../components/AccommodationForm";
import { useRouter } from "next/navigation";

const CreateAccommodationClient = () => {
  const router = useRouter();

  const handleSuccess = () => {
    // Redirect to accommodations list after successful creation
    router.push("/admin/accommodations");
  };

  return (
    <div>
      <AccommodationForm
        initialData={null}
        onSuccess={handleSuccess}
        isEditMode={false}
      />
    </div>
  );
};

export default CreateAccommodationClient;
