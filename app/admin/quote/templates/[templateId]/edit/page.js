// app/admin/quote/templates/[templateId]/edit/page.js

"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import QuoteTemplateForm from "../../QuoteTemplateForm";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { toast } from "react-toastify";

const EditQuoteTemplatePage = () => {
  const { templateId } = useParams();
  const [existingData, setExistingData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTemplateData = async () => {
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
        console.error("Error fetching template data:", error);
        toast.error("Failed to load template data.");
        router.push("/admin/quote/templates");
      }
    };

    if (templateId) {
      fetchTemplateData();
    }
  }, [templateId, router]);

  if (!existingData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Quote Template</h1>
      <QuoteTemplateForm
        isEdit={true}
        templateId={templateId}
        existingData={existingData}
      />
    </div>
  );
};

export default EditQuoteTemplatePage;
