// components/admin/tour-packages/TourPackagesList.js

"use client"; // Ensure this is a client component

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaEdit, FaEye } from "react-icons/fa";
import { BiTrash } from "react-icons/bi";
import { toast } from "react-toastify";
import axios from "axios";

const TourPackagesList = () => {
  // State variables
  const [tourPackages, setTourPackages] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();
  const [deletingTourSlug, setDeletingTourSlug] = useState(null); // Using slug instead of ID

  /**
   * Fetches tour packages from the backend API.
   */
  const fetchTourPackages = async () => {
    try {
      const response = await axios.get("/api/tour-packages", {
        params: {
          status: filterStatus,
          search: searchTerm,
        },
      });
      setTourPackages(response.data.tourPackages);
      console.log("Fetched Tour Packages:", response.data.tourPackages); // Debugging
    } catch (error) {
      console.error("Error fetching tour packages:", error);
      toast.error("Failed to fetch tour packages.");
    }
  };

  useEffect(() => {
    fetchTourPackages();

    // Polling every 5 seconds for real-time updates
    const interval = setInterval(fetchTourPackages, 5000);

    return () => clearInterval(interval);
  }, [filterStatus, searchTerm]);

  /**
   * Handles deletion of a tour package via the backend API.
   * @param {string} slug - The slug of the tour package to delete.
   */
  const handleDelete = async (slug) => {
    console.log("Delete Handler Called for Slug:", slug); // Debugging
    setDeletingTourSlug(slug); // Using slug as the identifier

    try {
      const response = await axios.delete(`/api/tour-packages/${slug}`);
      console.log("Delete API Response:", response); // Debugging
      if (response.status === 200) {
        toast.success("Tour package deleted successfully.");
        setTourPackages((prev) => prev.filter((tour) => tour.basicInfo.slug !== slug));
      } else {
        toast.error("Failed to delete tour package.");
      }
    } catch (error) {
      console.error("Error deleting tour package:", error);
      toast.error("Failed to delete tour package.");
    } finally {
      setDeletingTourSlug(null);
    }
  };

  /**
   * Handles showing the delete confirmation toast.
   * @param {string} slug - The slug of the tour package to delete.
   */
  const confirmDelete = (slug) => {
    console.log("Confirm Delete Called for Slug:", slug); // Debugging
    toast(
      ({ closeToast }) => (
        <div className="p-4">
          <p className="mb-4">
            Are you sure you want to delete this tour package? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => {
                handleDelete(slug);
                closeToast();
              }}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  /**
   * Handles search input change.
   * @param {Event} e - The input change event.
   */
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  /**
   * Calculates total number of pages based on filtered results.
   */
  const totalPages = Math.ceil(tourPackages.length / itemsPerPage) || 1;

  /**
   * Ensures current page is within valid bounds.
   */
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  /**
   * Retrieves the tour packages for the current page.
   */
  const paginatedTourPackages = tourPackages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /**
   * Handles page number changes.
   * @param {number} pageNumber - The page number to navigate to.
   */
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  /**
   * Renders pagination buttons.
   */
  const renderPagination = () => {
    const pages = [];

    let startPage = Math.max(1, currentPage - 3);
    let endPage = Math.min(totalPages, currentPage + 3);

    if (currentPage <= 4) {
      endPage = Math.min(7, totalPages);
    }
    if (currentPage > totalPages - 4) {
      startPage = Math.max(1, totalPages - 6);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={`page-${i}`}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 border rounded ${
            currentPage === i
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-black border-gray-300 hover:bg-blue-50"
          }`}
          aria-current={currentPage === i ? "page" : undefined}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center space-x-2 mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 border rounded ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed border-gray-300"
              : "bg-white text-black border-gray-300 hover:bg-gray-200"
          }`}
          aria-label="Previous Page"
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 border rounded ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed border-gray-300"
              : "bg-white text-black border-gray-300 hover:bg-gray-200"
          }`}
          aria-label="Next Page"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tour Packages</h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        {/* Filter Buttons */}
        <div className="flex space-x-4">
          {["All", "Draft", "Published"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-6 py-2 rounded-full border transition ${
                filterStatus === status
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
              }`}
              aria-pressed={filterStatus === status}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search tour packages..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Search Tour Packages"
          />
        </div>

        {/* Add New Package Button */}
        <button
          type="button"
          onClick={() => router.push("/admin/tour-packages/create")}
          className="inline-flex items-center bg-green-500 text-white px-5 py-3 rounded-md shadow hover:bg-green-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add New Package
        </button>
      </div>

      {/* Tour Packages Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SN#
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Destination
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedTourPackages.length > 0 ? (
              paginatedTourPackages.map((tour, index) => (
                <tr key={tour.id || `tour-${index}`} className="hover:bg-gray-50">
                  {/* Serial Number */}
                  <td className="py-4 px-6 text-sm text-gray-500">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>

                  {/* Image */}
                  <td className="py-4 px-6">
                    {tour.images && tour.images.length > 0 ? (
                      <div className="relative h-20 w-32">
                        <Image
                          src={tour.images[0].url}
                          alt={tour.basicInfo?.tourTitle || "Untitled"}
                          fill
                          style={{ objectFit: "cover" }}
                          className="rounded-md"
                          // Ensure images are optimized or use a loader if necessary
                        />
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">No Image</span>
                    )}
                  </td>

                  {/* Name */}
                  <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                    {tour.basicInfo?.tourTitle || "Untitled"}
                  </td>

                  {/* Destination */}
                  <td className="py-4 px-6 text-sm text-gray-500">
                    {tour.basicInfo?.country?.label || "N/A"}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tour.basicInfo.status === "Published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {tour.basicInfo.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="">
                    {/* Action Icons */}
                    <div className="flex space-x-4 justify-center items-center">
                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const editSlug = tour.basicInfo.slug;
                          if (editSlug) {
                            router.push(`/admin/tour-packages/edit/${editSlug}`);
                          } else {
                            toast.error("Invalid tour package slug.");
                          }
                        }}
                        className="text-blue-500 hover:text-blue-700 transition-transform transform hover:scale-110"
                        title="Edit"
                        aria-label={`Edit ${tour.basicInfo?.tourTitle || "Tour Package"}`}
                      >
                        <FaEdit size={20} />
                      </button>

                      {/* Delete Button */}
                      <BiTrash
                        className={`text-red-500 hover:text-red-700 cursor-pointer ${
                          deletingTourSlug === tour.basicInfo.slug ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        size={20}
                        onClick={() => {
                          if (deletingTourSlug !== tour.basicInfo.slug) {
                            confirmDelete(tour.basicInfo.slug);
                          }
                        }}
                        aria-label={`Delete ${tour.basicInfo?.tourTitle || "Tour Package"}`}
                      />

                      {/* View Button */}
                      <button
                        type="button"
                        onClick={() => router.push(`/admin/tour-packages/view/${tour.basicInfo.slug}`)}
                        className="text-green-500 hover:text-green-700 transition-transform transform hover:scale-110"
                        title="View"
                        aria-label={`View ${tour.basicInfo?.tourTitle || "Tour Package"}`}
                      >
                        <FaEye size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-4 px-6 text-sm text-center text-gray-500" colSpan="6">
                  No tour packages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && renderPagination()}
    </div>
  );
};

export default TourPackagesList;
