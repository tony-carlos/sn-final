"use client";

import React, { useEffect } from "react";
import Aos from "aos";

export default function Wrapper({ children }) {
  useEffect(() => {
    Aos.init({
      duration: 800,
      once: true,
    });
    
    // Any initialization code that needs to run on client side
    if (typeof window !== 'undefined') {
      // Initialize any browser-specific features
    }
  }, []);

  return <>{children}</>;
}