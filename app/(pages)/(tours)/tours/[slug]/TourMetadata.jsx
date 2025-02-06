// app/(pages)/(tours)/tours/[slug]/TourMetadata.jsx

// Server-side function to generate metadata based on the slug
export const generateMetadata = async ({ params }) => {
  const { slug } = params || {}; // Safely destructure the slug from params
  if (!slug) {
    console.warn("No slug provided in params.");
    return {
      title: "Tour Not Found",
      description: "The tour you are looking for does not exist.",
      keywords: "tour, not found",
    };
  }

  // Fetch SEO data using the slug
  try {
    const res = await fetch(`https://www.serengetinexus.com/api/seo/${slug}`);
    const seoData = await res.json();

    // If SEO data is successfully fetched, use it for the title
    return {
      title: seoData.seoTitle_en || `Tour: ${slug}`, // Use dynamic title from SEO data or default
      description: seoData.seoDescription_en || "Default Tour Description",
      keywords: seoData.seoKeywords_en || "default, keywords, tour",
    };
  } catch (error) {
    console.error("Error fetching SEO data:", error);
    return {
      title: `Tour: ${slug}`,
      description: "The tour you are looking for does not exist.",
      keywords: "tour, not found",
    };
  }
};
