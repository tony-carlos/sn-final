// app/admin/accommodations/components/AccommodationRow.js

"use client";

import React, { useState, Fragment } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BiEdit, BiTrash } from "react-icons/bi";
import { toast } from "react-toastify";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";

const AccommodationRow = ({ accommodation }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleEdit = () => {
    router.push(`/admin/accommodations/${accommodation.slug}/edit`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `/api/accommodations/delete/${accommodation.slug}`
      );
      if (response.status === 200) {
        toast.success("Accommodation deleted successfully.");
        router.refresh(); // Refresh the page to update the list
      } else {
        toast.error("Failed to delete accommodation.");
      }
    } catch (error) {
      console.error("Error deleting accommodation:", error);
      toast.error(
        error.response?.data?.error ||
          "An error occurred while deleting the accommodation."
      );
    } finally {
      setIsDeleting(false);
      closeModal();
    }
  };

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="py-3 px-4 border-b text-left">{accommodation.index}</td>
        <td className="py-3 px-4 border-b text-left">{accommodation.name}</td>
        <td className="py-3 px-4 border-b text-left">{accommodation.title}</td>
        <td className="py-3 px-4 border-b text-left">
          <div className="flex items-center">
            {accommodation.images && accommodation.images.length > 0 ? (
              <Image
                key={
                  accommodation.images[0].storagePath ||
                  `image-${accommodation.id}`
                }
                src={accommodation.images[0].url}
                alt={`Image of ${accommodation.name}`}
                width={80}
                height={80}
                className="object-cover rounded"
                loading="lazy" // Optimizes image loading
              />
            ) : (
              <Image
                src="/placeholder.png" // Path to your placeholder image
                alt="No Image Available"
                width={80}
                height={80}
                className="object-cover rounded"
                loading="lazy" // Optimizes image loading
              />
            )}
          </div>
        </td>
        <td className="py-3 px-4 border-b text-left">
          <button
            onClick={handleEdit}
            className="text-blue-500 hover:text-blue-700 mr-3"
            title="Edit Accommodation"
            aria-label={`Edit ${accommodation.name}`}
          >
            <BiEdit size={20} />
          </button>
          <button
            onClick={openModal}
            className="text-red-500 hover:text-red-700"
            title="Delete Accommodation"
            aria-label={`Delete ${accommodation.name}`}
          >
            <BiTrash size={20} />
          </button>
        </td>
      </tr>

      {/* Confirmation Modal using Headless UI */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {/* Overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                {/* Modal Panel */}
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    Confirm Deletion
                  </Dialog.Title>
                  <div className="mt-2 mb-6">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete{" "}
                      <strong>{accommodation.name}</strong>? This action cannot
                      be undone.
                    </p>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                      onClick={closeModal}
                      disabled={isDeleting}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default AccommodationRow;
