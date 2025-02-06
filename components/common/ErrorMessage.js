// /app/components/common/ErrorMessage.js

'use client'; // Ensure this is a client-side component

import React from 'react';
import PropTypes from 'prop-types';

/**
 * ErrorMessage Component
 *
 * Displays an error message.
 *
 * @param {Object} props - Component props.
 * @param {string} props.message - Error message to display.
 * @returns {JSX.Element} - Rendered error message.
 */
export default function ErrorMessage({ message }) {
  return (
    <div className="error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error:</strong>
      <span className="block sm:inline ml-2">{message}</span>
      <style jsx>{`
        .error-message {
          margin: 20px 0;
        }
      `}</style>
    </div>
  );
}

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};
