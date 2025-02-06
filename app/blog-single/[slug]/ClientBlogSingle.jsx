// app/blog-single/[slug]/ClientBlogSingle.jsx

"use client";

import BlogSingle from "@/components/blogs/BlogSingle";

export default function ClientBlogSingle({ slug }) {
  return <BlogSingle slug={slug} />;
}
