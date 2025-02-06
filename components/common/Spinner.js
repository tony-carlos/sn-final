// /app/components/common/Spinner.js

'use client'; // Ensure this is a client-side component

import React from 'react';

/**
 * Spinner Component
 *
 * Displays a loading spinner.
 *
 * @returns {JSX.Element} - Rendered spinner.
 */
export default function Spinner() {
  return (
    <div className="spinner-container d-flex justify-center align-center" style={{ minHeight: '200px' }}>
      <div className="spinner"></div>
      <style jsx>{`
        .spinner-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
        }
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border-left-color: #09f;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
