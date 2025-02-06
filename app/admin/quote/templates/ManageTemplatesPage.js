// app/admin/quote/templates/page.js

"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { db } from "@/app/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import {
  FaEdit,
  FaTrash,
  FaPlusCircle,
  FaArrowLeft,
  FaUser,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css"; // Import react-toastify CSS
import { confirmAlert } from "react-confirm-alert"; // Import react-confirm-alert
import "react-confirm-alert/src/react-confirm-alert.css"; // Import react-confirm-alert CSS
import Image from "next/image";

const ManageTemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "quoteTemplates"));
        const templatesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTemplates(templatesData);
      } catch (error) {
        console.error("Error fetching templates:", error);
        toast.error("Failed to load templates.");
      }
    };

    fetchTemplates();
  }, []);

  // Handle clicks outside the search box to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = (templateId) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this template?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await deleteDoc(doc(db, "quoteTemplates", templateId));
              setTemplates((prevTemplates) =>
                prevTemplates.filter((t) => t.id !== templateId)
              );
              toast.success("Template deleted successfully.");
            } catch (error) {
              console.error("Error deleting template:", error);
              toast.error("Failed to delete template.");
            }
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const filteredSuggestions = templates
        .filter((template) =>
          template.tourInfo?.tourTitle
            ?.toLowerCase()
            .includes(query.toLowerCase())
        )
        .map((template) => template.tourInfo?.tourTitle)
        .filter((title, index, self) => title && self.indexOf(title) === index); // Remove duplicates

      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  // Filter templates based on search query
  const filteredTemplates = searchQuery
    ? templates.filter((template) =>
        template.tourInfo?.tourTitle
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : templates;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header with Back Button, Search Bar, and Create Template Button */}
      <div className="flex items-center justify-between mb-6">
        {/* Back to Quote Button */}
        <Link
          href="/admin/quote"
          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          title="Back to Quotes"
        >
          <FaArrowLeft className="mr-2" />
          Back to Quote
        </Link>

        {/* Search Bar */}
        <div className="relative w-1/2" ref={searchRef}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            placeholder="Search by Tour Title..."
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto shadow-lg">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 hover:bg-green-100 cursor-pointer"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Create New Template Button */}
        <Link
          href="/admin/quote/templates/create"
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          title="Create New Template"
        >
          <FaPlusCircle className="mr-2" />
          Create New Template
        </Link>
      </div>

      {/* Templates Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded shadow-lg overflow-hidden flex flex-col"
          >
            {/* Top Section */}
            <div className="bg-black text-white px-4 py-2 text-sm flex justify-between items-center">
              {/* Starting Date */}
              <span>
                {template.clientInfo?.startingDay
                  ? new Date(template.clientInfo.startingDay).toLocaleDateString()
                  : "N/A"}
              </span>
              {/* Created By with User Icon */}
              <span className="flex items-center">
                <FaUser className="mr-1" />
                Serengeti Nexus
              </span>
            </div>

            {/* Middle Section */}
            <div
              className="relative bg-no-repeat bg-cover"
              style={{
                backgroundImage: `url('/template-pattern.svg')`,
                height: "120px", // Adjusted height as per instructions
              }}
            >
              <div className="relative h-full flex items-center px-4">
                {/* Logo */}
                <div className="flex-shrink-0">
                  <Image
                    src={template.logoUrl || "/image-gallery.png"} // Accessing logo directly from public folder
                    alt="Logo"
                    width={50}
                    height={70}
                    className="object-contain"
                  />
                </div>
                {/* Title and Status */}
                <div className="ml-4 text-black">
                  <h2 className="text-lg font-bold">
                    {template.tourInfo?.tourTitle || "Untitled Tour"}
                  </h2>
                  <p className="text-sm capitalize">
                    {template.status || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="px-4 py-4 flex-1">
              <p className="text-base text-gray-700 mb-1">
                <span className="font-semibold">Tour Type:</span>{" "}
                {template.tourInfo?.typeOfTour || "N/A"}
              </p>
              <p className="text-base text-gray-700 mb-1">
                <span className="font-semibold">Tour Length:</span>{" "}
                {template.totalDays || "N/A"} days
              </p>
              <p className="text-base text-gray-700 mb-1">
                <span className="font-semibold">Start Destination:</span>{" "}
                {template.tourInfo?.startingFrom || "N/A"}
              </p>
              <p className="text-base text-gray-700">
                <span className="font-semibold">End Destination:</span>{" "}
                {template.tourInfo?.endingFrom || "N/A"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="px-4 py-2">
              <div className="flex justify-between">
                {/* Edit Button */}
                <Link
                  href={`/admin/quote/templates/edit/${template.id}`}
                  className="flex items-center px-3 py-1 border border-green-600 text-green-600 rounded hover:bg-green-600 hover:text-white transition-colors"
                  title="Edit Template"
                >
                  <FaEdit className="mr-1" />
                  Edit
                </Link>

                {/* Add User Button */}
                <Link
                  href={`/admin/quote/templates/${template.id}/add-client`}
                  className="flex items-center px-3 py-1 border border-green-600 text-green-600 rounded hover:bg-green-600 hover:text-white transition-colors"
                  title="Add User"
                >
                  <FaUser className="mr-1" />
                  Add User
                </Link>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(template.id)}
                  className="flex items-center px-3 py-1 border border-green-600 text-green-600 rounded hover:bg-green-600 hover:text-white transition-colors"
                  title="Delete Template"
                >
                  <FaTrash className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredTemplates.length === 0 && (
          <div className="col-span-3 text-center text-gray-500">
            No templates found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTemplatesPage;
