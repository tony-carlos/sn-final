// /app/components/common/ErrorMessage.js

'use client';

import React from 'react';
import PropTypes from 'prop-types';

export default function ErrorMessage({ message }) {
  return (
    <div className="flex justify-center items-center py-8">
      <p className="text-red-500">{message}</p>
    </div>
  );
}

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};
