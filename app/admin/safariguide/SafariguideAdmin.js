// /app/admin/safariguide/page.js

"use client";

import React from "react";
import SafariguideForm from "./SafariguideForm"; // Ensure correct path
import SafariguideTable from "./SafariguideTable"; // Ensure correct path
import { Box, Divider } from "@mui/material";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const SafariguideAdmin = () => {
  return (
    <Box sx={{ p: 4 }}>
      {/* Toast Container for Notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Safari Guides Table */}
      <SafariguideTable />
    </Box>
  );
};

export default SafariguideAdmin;
