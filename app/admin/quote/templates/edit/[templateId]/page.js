
"use client";
export const runtime = "edge"; // <-- Add this at the top

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import TemplateForm from "../../components/TemplateForm";
import { db } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditTemplatePage = () => {
  const router = useRouter();
  const params = useParams();
  const templateId = params.templateId; // Ensure this matches your dynamic segment name
  const [existingData, setExistingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const docRef = doc(db, "quoteTemplates", templateId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setExistingData(docSnap.data());
        } else {
          toast.error("Template not found.");
          router.push("/admin/quote/templates");
        }
      } catch (error) {
        console.error("Error fetching template:", error);
        toast.error("Failed to load template.");
      } finally {
        setLoading(false);
      }
    };

    if (templateId) {
      fetchTemplate();
    }
  }, [templateId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Edit Template</h1>
      <TemplateForm isEdit={true} templateId={templateId} existingData={existingData} />
    </div>
  );
};

export default EditTemplatePage;
