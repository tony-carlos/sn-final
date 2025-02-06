"use client";

import React from "react";
import { useTours } from "@/app/hooks/useTours";
import Spinner from "@/components/common/Spinner";
import ErrorMessage from "@/components/common/ErrorMessage";

export default function SeoPage({ params }) {
  const { slug, lang } = params;
  const { tours, loading, error } = useTours();

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!tours || tours.length === 0) return <ErrorMessage message="No tours found." />;

  const tour = tours.find((t) => t.basicInfo.slug === slug);
  if (!tour) return <ErrorMessage message="Tour not found." />;

  // Extract SEO data based on the language
  let seoTitle = "N/A";
  let seoDescription = "N/A";
  let seoKeywords = "N/A";

  if (lang === "en") {
    seoTitle = tour.Seo?.seoTitle_en || "N/A";
    seoDescription = tour.Seo?.seoDescription_en || "N/A";
    seoKeywords = tour.Seo?.seoKeywords_en || "N/A";
  } else if (lang === "de") {
    seoTitle = tour.Seo?.seoTitle_DE || "N/A";
    seoDescription = tour.Seo?.seoDescription_DE || "N/A";
    seoKeywords = tour.Seo?.seoKeywords_DE || "N/A";
  } else {
    // If another language is provided, we can return an error or fallback
    return <ErrorMessage message="Invalid language parameter. Use 'en' or 'de'." />;
  }

  return (
    <main className="container py-10">
      <h1 className="text-2xl font-bold mb-5">{`SEO for ${tour.basicInfo?.tourTitle || "Untitled"} (${lang.toUpperCase()})`}</h1>
      <div className="space-y-4">
        <p><strong>SEO Title:</strong> {seoTitle}</p>
        <p><strong>SEO Description:</strong> {seoDescription}</p>
        <p><strong>SEO Keywords:</strong> {seoKeywords}</p>
      </div>
    </main>
  );
}
