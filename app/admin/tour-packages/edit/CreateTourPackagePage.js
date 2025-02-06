// /app/admin/tour-packages/create/page.js

"use client";

import React from "react";
import TourPackageForm from "../create/components/TourPackageForm";

const CreateTourPackagePage = () => {
  return (
    <div>
      <TourPackageForm isEdit={false} />
    </div>
  );
};

export default CreateTourPackagePage;
