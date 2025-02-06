"use client";

import React, { useEffect, useState, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { db, storage } from "@/app/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { toast } from "react-toastify";
import { BiTrash, BiEdit } from "react-icons/bi";
import AdminLayout from "../components/AdminLayout";
import { Dialog, Transition } from "@headlessui/react";
import { Router } from "next/router";

const AccommodationsList = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [accommodationToDelete, setAccommodationToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortByDate, setSortByDate] = useState("desc");
  const itemsPerPage = 10;

  // Fetch accommodations based on filter and date sort
  useEffect(() => {
    const fetchAccommodations = async () => {
      setLoading(true);
      try {
        let q = collection(db, "accommodations");

        if (filter !== "All") {
          q = query(q, where("status", "==", filter));
        }

        q = query(q, orderBy("updatedAt", sortByDate));

        const querySnapshot = await getDocs(q);
        const accommodationsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAccommodations(accommodationsData);
      } catch (error) {
        console.error("Error fetching accommodations:", error);
        toast.error("Failed to fetch accommodations.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, [filter, sortByDate]);

  // Handle Delete Accommodation
  const handleDelete = async () => {
    if (!accommodationToDelete) return;

    setDeleting(true);
    try {
      const { id, images } = accommodationToDelete;

      // Delete images from Firebase Storage
      if (Array.isArray(images)) {
        const deletePromises = images.map((img) => {
          if (img.storagePath) {
            const imageRef = ref(storage, img.storagePath);
            return deleteObject(imageRef).catch((err) => {
              console.error("Error deleting image:", err);
            });
          }
          return Promise.resolve();
        });
        await Promise.all(deletePromises);
      }

      // Delete accommodation document
      await deleteDoc(doc(db, "accommodations", id));
      toast.success("Accommodation deleted successfully!");

      // Refresh the list
      setAccommodations(accommodations.filter((acc) => acc.id !== id));
    } catch (error) {
      console.error("Error deleting accommodation:", error);
      toast.error("Failed to delete accommodation.");
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setAccommodationToDelete(null);
    }
  };

  // Open Delete Confirmation Modal
  const openDeleteModal = (accommodation) => {
    setAccommodationToDelete(accommodation);
    setDeleteModalOpen(true);
  };

  // Close Delete Confirmation Modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setAccommodationToDelete(null);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter accommodations based on search term
  const filteredAccommodations = accommodations.filter((acc) =>
    acc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredAccommodations.length / itemsPerPage);
  const paginatedAccommodations = filteredAccommodations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Accommodations</h1>

      {/* Filters, Search Bar, and Create New Button */}
      <div className="mb-6 flex justify-between items-center">
        {/* Filters */}
        <div className="flex space-x-4">
          {["All"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 bg-green-500  border transition ${
                filter === status
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Bar */}

        {/* Search Bar */}
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search accommodations..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Search Tour Packages"
          />
        </div>

        {/* Create New Accommodation Button */}
        <Link href="/admin/accommodations/create" passHref>
          <button className="inline-flex items-center bg-green-500 text-white px-5 py-3 rounded-md shadow hover:bg-green-600 transition-colors">
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
            Create New Accommodation
          </button>
        </Link>
      </div>

      {/* Accommodations Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <svg
              className="animate-spin h-10 w-10 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          </div>
        ) : paginatedAccommodations.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">No accommodations found.</p>
          </div>
        ) : (
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
              {paginatedAccommodations.map((acc, index) => (
                <tr key={acc.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm text-gray-900">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="py-4 px-6">
                    {Array.isArray(acc.images) &&
                    acc.images.length > 0 &&
                    acc.images[0]?.url ? (
                      <Image
                        src={acc.images[0].url}
                        alt={acc.name}
                        width={80}
                        height={50}
                        className="object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">
                    {acc.name || "N/A"}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">
                    {acc.title || "N/A"}
                  </td>
                  <td className="py-4 px-6 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        acc.status === "Published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {acc.status || "Draft"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-center">
                    <div className="flex justify-center space-x-4">
                      {acc.slug ? (
                        <Link href={`/admin/accommodations/${acc.slug}/edit`}>
                          <span className="text-blue-500 hover:text-blue-700 flex items-center cursor-pointer">
                            <BiEdit size={20} />{" "}
                            <span className="ml-1">Edit</span>
                          </span>
                        </Link>
                      ) : (
                        <span className="text-gray-400">No Slug</span>
                      )}
                      <button
                        onClick={() => openDeleteModal(acc)}
                        className="text-red-500 hover:text-red-700 flex items-center"
                      >
                        <BiTrash size={20} />{" "}
                        <span className="ml-1">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 bg-gray-200 rounded ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-300"
            }`}
          >
            Previous
          </button>
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </p>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 bg-gray-200 rounded ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-300"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Transition appear show={deleteModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeDeleteModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0  bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Delete Accommodation
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete the accommodation &quot;
                      <span className="font-semibold">
                        {accommodationToDelete?.name}
                      </span>
                      &quot;? This action cannot be undone.
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                      onClick={closeDeleteModal}
                      disabled={deleting}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                      onClick={handleDelete}
                      disabled={deleting}
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default AccommodationsList;
