// /app/components/common/Spinner.js

'use client';

import React from 'react';

export default function Spinner() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  );
}
