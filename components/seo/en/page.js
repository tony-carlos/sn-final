"use client";

import React from "react";
import { useTours } from "@/app/hooks/useTours";
import Spinner from "@/components/common/Spinner";
import ErrorMessage from "@/components/common/ErrorMessage";

export default function EnglishSeoPage() {
  const { tours, loading, error } = useTours();

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!tours || tours.length === 0) return <ErrorMessage message="No tours found." />;

  return (
    <main className="container py-10">
      <h1 className="text-2xl font-bold mb-5">English SEO Metadata for Tours</h1>
      <div className="space-y-8">
        {tours.map((tour) => (
          <div key={tour.id} className="p-4 border rounded">
            <h2 className="text-xl font-semibold mb-2">{tour.basicInfo?.tourTitle || "Untitled Tour"}</h2>
            <p><strong>SEO Title (EN):</strong> {tour.Seo?.seoTitle_en || "N/A"}</p>
            <p><strong>SEO Description (EN):</strong> {tour.Seo?.seoDescription_en || "N/A"}</p>
            <p><strong>SEO Keywords (EN):</strong> {tour.Seo?.seoKeywords_en || "N/A"}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
