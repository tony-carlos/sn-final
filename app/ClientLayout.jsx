// app/ClientLayout.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ScrollToTop from '@/components/common/ScrollToTop';
import ScrollTopBehaviour from '@/components/common/ScrollTopBehavier';
import Wrapper from '@/components/layout/Wrapper';
import { AuthProvider } from '@/context/AuthContext';
import GTranslateWidget from '@/components/GTranslateWidget';

export default function ClientLayout({ children }) {
  const [client] = useState(() => new QueryClient());
  
  useEffect(() => {
    // Load Bootstrap JS only on client side
    if (typeof window !== 'undefined') {
      require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);

  return (
    <>
      {/* Modal Root for Portals */}
      <div id="modal-root"></div>

      {/* Toast Notifications Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        newestOnTop
        rtl={false}
        pauseOnFocusLoss
      />

      {/* React Query Provider */}
      <AuthProvider>
        <QueryClientProvider client={client}>
          <Wrapper>{children}</Wrapper>
        </QueryClientProvider>
      </AuthProvider>
      <GTranslateWidget />
      <ScrollTopBehaviour />
    </>
  );
}