// app/admin/accommodations/components/CustomSelect.js

"use client";

import dynamic from "next/dynamic";

// Dynamically import react-select with SSR disabled
const ReactSelect = dynamic(() => import("react-select"), { ssr: false });

const CustomSelect = (props) => {
  return <ReactSelect {...props} />;
};

export default CustomSelect;
