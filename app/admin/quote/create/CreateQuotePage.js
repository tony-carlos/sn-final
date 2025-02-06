// /app/admin/quote/create/page.js

"use client";

import React from "react";
import QuoteMakerForm from "../components/QuoteMakerForm";

const CreateQuotePage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create New Quote</h1>
      <QuoteMakerForm isEdit={false} />
    </div>
  );
};

export default CreateQuotePage;
