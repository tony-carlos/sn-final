// app/admin/accommodations/[slug]/edit/EditAccommodationClient.js

"use client";

import React from "react";
import AccommodationForm from "../../components/AccommodationForm";

import { useRouter } from "next/navigation";
import PropTypes from "prop-types";

const EditAccommodationClient = ({ initialData, isEditMode }) => {
  const router = useRouter();

  const handleSuccess = () => {
    // Redirect to accommodations list after successful edit
    router.push("/admin/accommodations");
  };

  return (
    <div>
      <AccommodationForm
        initialData={initialData}
        onSuccess={handleSuccess}
        isEditMode={isEditMode}
      />
    </div>
  );
};

EditAccommodationClient.propTypes = {
  initialData: PropTypes.object.isRequired,
  isEditMode: PropTypes.bool.isRequired,
};

export default EditAccommodationClient;
