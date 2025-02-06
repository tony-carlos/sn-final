"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Correct import for App Router

const QuotePdfView = () => {
  const params = useParams(); // Access route parameters
  const { id } = params; // Destructure 'id'

  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchPdf = async () => {
        try {
          const response = await fetch(`/api/quotes/${id}/pdf`);
          if (!response.ok) {
            throw new Error("Failed to fetch PDF");
          }
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
        } catch (error) {
          console.error(error);
          alert("Failed to load PDF.");
        } finally {
          setLoading(false);
        }
      };

      fetchPdf();
    }
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10">Loading PDF...</div>;
  }

  if (!pdfUrl) {
    return <div className="text-center mt-10">No PDF available.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between mb-4">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Back
        </button>
        <a
          href={pdfUrl}
          download={`quote_${id}.pdf`}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download PDF
        </a>
      </div>
      <iframe
        src={pdfUrl}
        className="w-full h-[80vh]"
        title="Quote PDF"
      ></iframe>
    </div>
  );
};

export default QuotePdfView;
