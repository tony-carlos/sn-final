// /app/components/ToastNotification.js

'use client'; // Designate as a client component

import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * ToastNotification Component
 *
 * Displays toast notifications.
 *
 * @returns {JSX.Element} - Rendered toast container.
 */
export default function ToastNotification() {
  return <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />;
}
