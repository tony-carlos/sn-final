// src/components/MainInformation2.jsx

"use client";

import React, { useState } from "react";
import { toast } from "react-toastify"; // Importing toast from React Toastify
import { FaMapMarkerAlt, FaShareAlt, FaTimes } from "react-icons/fa"; // Importing icons from react-icons
import { Modal, Box, Typography, Button } from "@mui/material"; // Importing MUI components
import "react-toastify/dist/ReactToastify.css"; // Import React Toastify CSS

/**
 * MainInformation2 Component
 *
 * Props:
 * - tour: Object containing tour details.
 * - user: Object containing user details (for wishlist functionality, if needed in future).
 */
export default function MainInformation2({ tour, user }) {
  const [showShareModal, setShowShareModal] = useState(false);

  /**
   * Handles the sharing functionality based on the selected method.
   *
   * @param {string} method - The sharing method ('email', 'whatsapp', 'copy').
   */
  const handleShare = (method) => {
    const shareUrl = window.location.href; // Current page URL
    const shareText = `Check out this tour: ${tour?.basicInfo?.tourTitle}`;

    switch (method) {
      case "email":
        window.location.href = `mailto:?subject=${encodeURIComponent(
          "Check out this tour"
        )}&body=${encodeURIComponent(shareText + "\n" + shareUrl)}`;
        toast.success("Email client opened!", {
          className: "toast-custom",
        });
        break;
      case "whatsapp":
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(
            shareText + " " + shareUrl
          )}`,
          "_blank"
        );
        toast.success("WhatsApp opened!", {
          className: "toast-custom",
        });
        break;
      case "copy":
        navigator.clipboard
          .writeText(shareUrl)
          .then(() => {
            toast.success("Link copied to clipboard!", {
              className: "toast-custom",
            });
          })
          .catch(() => {
            toast.error("Failed to copy the link.", {
              className: "toast-custom-error",
            });
          });
        break;
      default:
        break;
    }

    setShowShareModal(false);
  };

  /**
   * Capitalizes the first letter of a given string.
   *
   * @param {string} string - The string to capitalize.
   * @returns {string} - The capitalized string.
   */
  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6  rounded-lg shadow-md">
      {/* Left Section: Title and Country */}
      <div className="flex flex-col w-full md:w-auto">
        {/* Tour Title */}
        <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl">
          {tour?.basicInfo?.tourTitle}
        </h2>

        {/* Spacer */}
        <div className="h-4"></div>

        {/* Location and Share Icon */}
        <div className="flex justify-between items-center w-full">
          {/* Location */}
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-gray-500 mr-2" />
            <span className="text-sm text-gray-700">
              {capitalizeFirstLetter(tour?.basicInfo?.country?.label)}
            </span>
          </div>

          {/* Share Icon */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center justify-center w-10 h-10 bg-accent-1 text-white rounded-full hover:bg-accent-2 transition-colors duration-200"
            aria-label="Share Tour"
          >
            <FaShareAlt size={24} />
          </button>
        </div>
      </div>

      {/* Share Modal */}
      <Modal
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        aria-labelledby="share-modal-title"
        aria-describedby="share-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 6,
            textAlign: "center",
            border: "none", // **Remove border stroke here**
          }}
        >
          {/* Close Icon */}
          <button
            onClick={() => setShowShareModal(false)}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            aria-label="Close Share Modal"
          >
            <FaTimes size={20} />
          </button>

          <Typography
            id="share-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            Share this Tour
          </Typography>

          {/* Share Options */}
          <div className="flex flex-col space-y-4 mt-6">
            {/* Share via Email */}
            <Button
              onClick={() => handleShare("email")}
              variant="contained"
              sx={{
                backgroundColor: "#947a57",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#84654e",
                },
              }}
              fullWidth
              startIcon={<FaShareAlt />}
              aria-label="Share via Email"
            >
              Share via Email
            </Button>

            {/* Share via WhatsApp */}
            <Button
              onClick={() => handleShare("whatsapp")}
              variant="contained"
              sx={{
                backgroundColor: "#947a57",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#84654e",
                },
              }}
              fullWidth
              startIcon={<FaShareAlt />}
              aria-label="Share via WhatsApp"
            >
              Share via WhatsApp
            </Button>

            {/* Copy Link */}
            <Button
              onClick={() => handleShare("copy")}
              variant="contained"
              sx={{
                backgroundColor: "#947a57",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#84654e",
                },
              }}
              fullWidth
              startIcon={<FaShareAlt />}
              aria-label="Copy Link"
            >
              Copy Link
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
