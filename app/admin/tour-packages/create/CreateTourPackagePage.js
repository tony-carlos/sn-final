// /app/admin/tour-packages/create/page.js

"use client";

import React from "react";
import TourPackageForm from "./components/TourPackageForm";

/**
 * CreateTourPackagePage Component
 *
 * Renders the TourPackageForm in create mode.
 */
const CreateTourPackagePage = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Create New Tour Package</h1>
      <TourPackageForm isEdit={false} />
    </div>
  );
};

export default CreateTourPackagePage;
