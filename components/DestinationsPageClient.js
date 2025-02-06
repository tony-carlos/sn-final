// components/DestinationsPageClient.js

"use client";

import React, { useState, useEffect } from "react";
import { db, storage } from "@/app/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { toast } from "react-toastify";
import { BiEdit, BiTrash } from "react-icons/bi";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ConfirmDeleteToast from "@/components/ConfirmDeleteToast"; // Import the confirmation toast
import { transformDestination } from "@/app/lib/transformData"; // Import the helper function

const DestinationsPageClient = ({ initialDestinations }) => {
  const router = useRouter();
  const [destinations, setDestinations] = useState(initialDestinations);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [toursCountMap, setToursCountMap] = useState({});
  const itemsPerPage = 12;

  // Fetch destinations based on filter
  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      try {
        let q;
        const destinationsRef = collection(db, "destinations");
        if (filter === "Published") {
          q = query(destinationsRef, where("status", "==", "Published"));
        } else if (filter === "Draft") {
          q = query(destinationsRef, where("status", "==", "Draft"));
        } else {
          q = query(destinationsRef);
        }

        const querySnapshot = await getDocs(q);
        const dests = [];

        querySnapshot.forEach((doc) => {
          dests.push(transformDestination(doc));
        });

        setDestinations(dests);
        setCurrentPage(1); // Reset to first page on filter change
      } catch (error) {
        console.error("Error fetching destinations:", error);
        toast.error("Failed to fetch destinations.");
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [filter]);

  // Fetch tours count for each destination
  useEffect(() => {
    const fetchToursCount = async () => {
      const countMap = {};
      try {
        const toursRef = collection(db, "tours");
        const q = query(toursRef, where("status", "==", "Published"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const tour = doc.data();
          const destinationId = tour.destinationId;
          if (destinationId) {
            countMap[destinationId] = (countMap[destinationId] || 0) + 1;
          }
        });
        setToursCountMap(countMap);
      } catch (error) {
        console.error("Error fetching tours count:", error);
        toast.error("Failed to fetch tours count.");
      }
    };

    fetchToursCount();
  }, [destinations]);

  // Handle delete destination with confirmation toast
  const handleDelete = (destination) => {
    toast.info(
      <ConfirmDeleteToast onConfirm={() => deleteDestination(destination)} />,
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  // Actual deletion logic
  const deleteDestination = async (destination) => {
    try {
      const images = destination.images || [];
      const deletePromises = images.map((img) => {
        if (img.storagePath) {
          const imgRef = ref(storage, img.storagePath);
          return deleteObject(imgRef);
        }
        return Promise.resolve();
      });

      await Promise.all(deletePromises);

      const destDocRef = doc(db, "destinations", destination.id);
      await deleteDoc(destDocRef);

      setDestinations((prev) =>
        prev.filter((dest) => dest.id !== destination.id)
      );
      toast.success("Destination deleted successfully!");
    } catch (error) {
      console.error("Error deleting destination:", error);
      toast.error("Failed to delete destination.");
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter destinations based on search term
  const filteredDestinations = destinations.filter((dest) =>
    dest.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredDestinations.length / itemsPerPage);
  const paginatedDestinations = filteredDestinations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 border rounded ${
            currentPage === i
              ? "bg-blue-500 text-white"
              : "bg-white text-black hover:bg-gray-200"
          }`}
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
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-white text-black hover:bg-gray-200"
          }`}
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 border rounded ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-white text-black hover:bg-gray-200"
          }`}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Destinations</h1>

      {/* Filters, Search Bar, and Create New Button */}
      <div className="flex justify-between items-center mb-6">
        {/* Filters */}
        <div className="flex space-x-4">
          {["All", "Published", "Draft"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-full border transition ${
                filter === status
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search destinations..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Create New Destination Button */}
        <Link href="/admin/destinations/create" passHref>
          <button className="inline-flex items-center bg-green-500 text-white px-5 py-3 rounded-md shadow hover:bg-green-600 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create New Destination
          </button>
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SN#
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Destination Title
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tours
              </th>
              <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-10">
                  Loading...
                </td>
              </tr>
            ) : paginatedDestinations.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10">
                  No destinations found.
                </td>
              </tr>
            ) : (
              paginatedDestinations.map((dest, index) => (
                <tr key={dest.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm text-gray-500">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                    {dest.title}
                    {dest.zone && (
                      <div className="text-gray-400 text-xs italic">
                        {dest.zone}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {dest.images && dest.images.length > 0 ? (
                      <Image
                        src={dest.images[0].url}
                        alt={dest.title}
                        width={80}
                        height={60}
                        className="object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">No Image</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">
                    {toursCountMap[dest.id] || 0}
                  </td>
                  <td className="py-4 px-6 text-sm flex justify-center space-x-4">
                    <BiEdit
                      className="text-blue-500 hover:text-blue-700 cursor-pointer"
                      size={20}
                      onClick={() =>
                        router.push(`/admin/destinations/${dest.id}`)
                      }
                    />
                    <BiTrash
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                      size={20}
                      onClick={() => handleDelete(dest)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && renderPagination()}
    </div>
  );
};

export default DestinationsPageClient;
