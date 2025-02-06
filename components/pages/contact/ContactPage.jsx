"use client";
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from "react";

const Header2 = dynamic(
  () => import("@/components/layout/header/Header2"),
  {
    loading: () => <div className="h-20 bg-gray-100 animate-pulse"></div>,
    ssr: false
  }
);

const Map = dynamic(
  () => import("@/components/pages/contact/Map"),
  {
    loading: () => <div className="h-[400px] bg-gray-50 animate-pulse"></div>,
    ssr: false
  }
);

const ContactForm = dynamic(
  () => import("@/components/pages/contact/ContactForm"),
  {
    loading: () => (
      <div className="container mx-auto p-6">
        <div className="h-[600px] bg-gray-100 rounded-lg animate-pulse"></div>
      </div>
    ),
    ssr: false
  }
);

const FooterOne = dynamic(
  () => import("@/components/layout/footers/FooterOne"),
  {
    loading: () => <div className="h-60 bg-gray-100 animate-pulse"></div>,
    ssr: false
  }
);

const ContactPage = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen">
        <div className="h-20 bg-gray-100 animate-pulse"></div>
        <div className="h-[400px] bg-gray-50 animate-pulse"></div>
        <div className="container mx-auto p-6">
          <div className="h-[600px] bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
        <div className="h-60 bg-gray-100 animate-pulse"></div>
      </div>
    );
  }

  return (
    <main>
      <Header2 />
      <Map />
      <ContactForm />
      <FooterOne />
    </main>
  );
};

export default ContactPage;