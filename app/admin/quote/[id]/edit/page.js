"use client";
export const runtime = "edge"; // <-- Add this at the top

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import QuoteMakerForm from "../../components/QuoteMakerForm";
import { db } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditQuotePage = () => {
  const router = useRouter();
  const params = useParams(); // Retrieve route parameters
  const quoteId = params.id; // Assuming your dynamic route is named [id]
  const [existingData, setExistingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const docRef = doc(db, "quotes", quoteId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setExistingData(docSnap.data());
        } else {
          toast.error("Quote not found.");
          router.push("/admin/quote");
        }
      } catch (error) {
        console.error("Error fetching quote:", error);
        toast.error("Failed to load quote.");
      } finally {
        setLoading(false);
      }
    };

    if (quoteId) {
      fetchQuote();
    }
  }, [quoteId, router]);

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
      <h1 className="text-2xl font-bold mb-4">Edit Quote</h1>
      <QuoteMakerForm isEdit={true} quoteId={quoteId} existingData={existingData} />
    </div>
  );
};

export default EditQuotePage;
