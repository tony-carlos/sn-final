// /app/admin/safariguide/[slug]/page.js

"use client";
export const runtime = "edge"; // <-- Add this at the top

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Box, Typography, ImageList, ImageListItem } from "@mui/material";
import Head from "next/head";
import Image from "next/image"; // Import Image from next/image

const SafariGuidePage = () => {
  const { slug } = useParams();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const guideRef = doc(db, "safariguide", slug);
        const guideSnap = await getDoc(guideRef);
        if (guideSnap.exists()) {
          setGuide(guideSnap.data());
        } else {
          console.error("No such document!");
          setGuide(null);
        }
      } catch (error) {
        console.error("Error fetching guide: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuide();
  }, [slug]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!guide) return <Typography>Guide not found.</Typography>;

  return (
    <>
      <Head>
        <title>{guide.seo.title}</title>
        <meta name="description" content={guide.seo.description} />
        <meta name="keywords" content={guide.seo.keywords.join(", ")} />
        {guide.seo.image && <meta property="og:image" content={guide.seo.image} />}
      </Head>
      <Box sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom>
          {guide.title}
        </Typography>
        <Typography
          variant="body1"
          gutterBottom
          dangerouslySetInnerHTML={{ __html: guide.description }}
        />
        {guide.images && guide.images.length > 0 && (
          <ImageList cols={3} rowHeight={164}>
            {guide.images.map((img, index) => (
              <ImageListItem key={index}>
                <Image
                  src={img}
                  alt={`Guide Image ${index + 1}`}
                  width={200}
                  height={164}
                  objectFit="cover"
                />
              </ImageListItem>
            ))}
          </ImageList>
        )}
      </Box>
    </>
  );
};

export default SafariGuidePage;
