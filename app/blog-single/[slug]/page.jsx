// app/blog-single/[slug]/page.jsx

import FooterOne from "@/components/layout/footers/FooterOne";
import Header1 from "@/components/layout/header/Header1";
import Hero1 from "@/components/blogs/Hero1";
import BlogSingle from "@/components/blogs/BlogSingle";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "@/app/lib/firebase"; // Ensure correct Firestore import
import Header2 from "@/components/layout/header/Header2";

export default async function page({ params }) {
  const slug = params.slug;
  let blog = null;
  let error = null;

  try {
    const blogsRef = collection(db, "blogs");
    const q = query(blogsRef, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docSnapshot = querySnapshot.docs[0];
      blog = { id: docSnapshot.id, ...docSnapshot.data() };
    } else {
      error = "Blog not found.";
    }
  } catch (err) {
    console.error("Error fetching blog:", err);
    error = "Error fetching blog.";
  }

  return (
    <>
      <main>
        <Header2 />
        <Hero1 blog={blog} />
        <BlogSingle blog={blog} />
        <FooterOne />
      </main>
    </>
  );
}

/**
 * Generates dynamic metadata for each blog post based on its slug.
 *
 * @param {Object} params - Route parameters.
 * @returns {Object} - Metadata object.
 */
export async function generateMetadata({ params }) {
  const slug = params.slug;
  let blog = null;
  let error = null;

  try {
    const blogsRef = collection(db, "blogs");
    const q = query(blogsRef, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docSnapshot = querySnapshot.docs[0];
      blog = { id: docSnapshot.id, ...docSnapshot.data() };
    } else {
      error = "Blog not found.";
    }
  } catch (err) {
    console.error("Error fetching blog:", err);
    error = "Error fetching blog.";
  }

  // Define default keywords related to Tanzania
  const defaultKeywords = [
    "Tanzania Travel",
    "Safari in Tanzania",
    "Mount Kilimanjaro",
    "Zanzibar Beaches",
    "Serengeti National Park",
    "Ngorongoro Crater",
    "Tanzanian Culture",
    "Wildlife in Tanzania",
    "Tanzania Tourism",
    "African Adventures",
    "Tanzania Destinations",
    "Tanzanian Cuisine",
    "Safari Packages",
    "Tanzania Wildlife",
    "Explore Tanzania",
  ];

  // Compose meta description
  const metaDescription = blog
    ? `${blog.desc} ${defaultKeywords.join(", ")}`
    : `Discover the beauty of Tanzania. ${defaultKeywords.join(", ")}`;

  return {
    title: blog ? blog.title : "Blog Not Found",
    description: metaDescription,
    keywords: defaultKeywords.join(", "),
  };
}
