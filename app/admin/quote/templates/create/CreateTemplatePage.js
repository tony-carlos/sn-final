// /app/admin/quote/templates/create/page.js

"use client";

import React from "react";
import TemplateForm from "../components/TemplateForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const CreateTemplatePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Create New Template</h1>
      <TemplateForm isEdit={false} />
    </div>
  );
};

export default CreateTemplatePage;
