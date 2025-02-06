// app/components/ClientLayout.jsx
"use client";
import { useEffect, useState } from 'react';

export default function ClientLayout({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}