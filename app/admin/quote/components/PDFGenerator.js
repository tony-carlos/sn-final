// /app/admin/quote/components/PDFGenerator.js

"use client";

import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useFormContext } from "react-hook-form";
import Image from "next/image"; // Using Next.js Image component for optimization

const PDFGenerator = () => {
  const pdfRef = useRef();
  const { getValues } = useFormContext();

  const generatePDF = async () => {
    const input = pdfRef.current;
    if (!input) {
      console.error("PDF content not found!");
      return;
    }

    try {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("itinerary.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const formData = getValues(); // Retrieve form data

  return (
    <div className="mt-4">
      <button
        onClick={generatePDF}
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
      >
        Download PDF
      </button>

      {/* Hidden div containing the PDF content */}
      <div ref={pdfRef} className="hidden">
        {/* Example PDF Content */}
        <div className="p-4">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-2">
            <span>Ref Number: #{formData.basicInfo.slug || "N/A"}</span>
            <span>{formData.basicInfo.clientName}</span>
          </div>

          {/* Tour Details */}
          <div className="flex justify-between items-center border-b pb-2 mt-2">
            <div>
              <p>Tour Length: {formData.basicInfo.numberOfDays} Days</p>
              <p>
                Travelers: {formData.pricing.numberOfAdults} Adults, {formData.pricing.numberOfChildren} Children
              </p>
            </div>
            <div>
              <p>
                Start Tour:{" "}
                {formData.basicInfo.startTourDate
                  ? new Date(formData.basicInfo.startTourDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                End Tour:{" "}
                {formData.basicInfo.endTourDate
                  ? new Date(formData.basicInfo.endTourDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Title Section */}
          <div className="text-center mt-4">
            <h1 className="text-2xl font-bold">{formData.basicInfo.tourTitle}</h1>
          </div>

          {/* Message Box */}
          <div className="border border-gray-300 rounded-md p-4 mt-4 bg-gray-100 opacity-80">
            <p>Dear {formData.basicInfo.clientName},</p>
            <p className="mt-2">
              We are delighted to send you our custom-made quote for your {formData.basicInfo.tourTitle}. Your tour begins on{" "}
              {formData.basicInfo.startTourDate
                ? new Date(formData.basicInfo.startTourDate).toLocaleDateString()
                : "N/A"}{" "}
              in{" "}
              {formData.itinerary[0]?.destination
                ?.map((dest) => dest.label)
                .join(", ") || "N/A"}
              , runs over {formData.basicInfo.numberOfDays} days, and ends on{" "}
              {formData.basicInfo.endTourDate
                ? new Date(formData.basicInfo.endTourDate).toLocaleDateString()
                : "N/A"}{" "}
              in{" "}
              {formData.itinerary[formData.itinerary.length - 1]?.destination
                ?.map((dest) => dest.label)
                .join(", ") || "N/A"}
              . We feel sure that you will be as excited about this safari as we are to have you join us. Please let us know if you have any questions.
            </p>
            <p className="mt-2">We look forward to hearing from you.</p>
            <p className="mt-4">
              Best regards,<br />
              Serengeti Nexus.
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-4">
            <span>Serengeti Nexus Website</span>
            <div className="h-8 relative">
              <Image src="/logo-light.png" alt="Serengeti Nexus Logo" layout="fill" objectFit="contain" />
            </div>
          </div>
        </div>

        {/* Additional Pages: Summary, Map, Itinerary Details, Pricing */}
        {/* Implement similar structures for additional pages as per specifications */}
      </div>
    </div>
  );
};

export default PDFGenerator;
