"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { toast } from "react-toastify";
import useAllQuotes from "@/app/hooks/useAllQuotes"; // Using the newly created hook
import {
  FaEye,
  FaTrash,
  FaEdit,
  FaCalendarAlt,
  FaFilePdf,
  FaLaptop,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const QuoteListPage = () => {
  const { quotes, loading, error } = useAllQuotes(); // Using the new hook
  const [currentPage, setCurrentPage] = useState(1);
  const quotesPerPage = 10;
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

  const handleDelete = (quoteId) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this quote?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await deleteDoc(doc(db, "quotes", quoteId));
              toast.success("Quote deleted successfully.");
              // Remove the deleted quote from the state to update UI immediately
              // This requires that we have access to setQuotes, but since we're using a custom hook,
              // we'll need to refetch or implement a way to update the quotes.
              // For simplicity, we'll assume quotes are refetched or use a workaround.
              // Alternatively, consider lifting the state up or enhancing the hook to support deletions.
            } catch (error) {
              console.error("Error deleting quote:", error);
              toast.error("Failed to delete quote.");
            }
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Memoized filtered quotes based on search query
  const filteredQuotes = useMemo(() => {
    if (!searchQuery) return quotes;

    const lowerCaseQuery = searchQuery.toLowerCase();

    return quotes.filter((quote) => {
      const clientName = quote.clientInfo?.clientName || "";
      const email = quote.clientInfo?.email || "";
      const tourTitle = quote.tourInfo?.tourTitle || "";

      return (
        clientName.toLowerCase().includes(lowerCaseQuery) ||
        email.toLowerCase().includes(lowerCaseQuery) ||
        tourTitle.toLowerCase().includes(lowerCaseQuery)
      );
    });
  }, [quotes, searchQuery]);

  // Pagination logic
  const indexOfLastQuote = currentPage * quotesPerPage;
  const indexOfFirstQuote = indexOfLastQuote - quotesPerPage;
  const currentQuotes = filteredQuotes.slice(indexOfFirstQuote, indexOfLastQuote);
  const totalPages = Math.ceil(filteredQuotes.length / quotesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="text-center mt-10">Loading quotes...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header with Create Quote, Search, and Manage Templates Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/quote/create"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center"
            title="Create New Quote"
          >
            Create Quote Direct
          </Link>
          {/* Search Input */}
          
        </div>
        <div>
        <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by name, email, or tour title..."
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Link
          href="/admin/quote/templates"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center"
          title="Manage Templates"
        >
          Manage Templates
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr>
              {/* Added "No" Column */}
              <th className="px-4 py-2 border-b text-left">No</th>
              <th className="px-4 py-2 border-b text-left">Client</th>
              <th className="px-4 py-2 border-b text-left">Tour Title</th>
              <th className="px-4 py-2 border-b text-left">Status</th>
              <th className="px-4 py-2 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentQuotes.map((quote, index) => (
              <tr key={quote.id} className="hover:bg-gray-50">
                {/* "No" Column with correct numbering */}
                <td className="px-4 py-2 border-b text-left">
                  {indexOfFirstQuote + index + 1}
                </td>
                {/* Client Column */}
                <td className="px-4 py-2 border-b text-left">
                  <div className="font-semibold">{quote.clientInfo?.clientName || "N/A"}</div>
                  <div className="italic text-gray-600">{quote.clientInfo?.email || "N/A"}</div>
                  <div className="flex items-center mt-1 text-gray-400">
                    <FaCalendarAlt className="mr-2" />
                    <span className="text-sm">
                      Starting date:{" "}
                      {quote.clientInfo?.startingDay
                        ? new Date(quote.clientInfo.startingDay).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </td>
                {/* Tour Title Column */}
                <td className="px-4 py-2 border-b text-left">
                  <div className="font-semibold">{quote.tourInfo?.tourTitle || "N/A"}</div>
                  <div className="text-sm capitalize text-gray-600">
                    {quote.tourInfo?.typeOfTour || "N/A"}
                  </div>
                </td>
                {/* Status Column */}
                <td className="px-4 py-2 border-b text-left capitalize">
                  {quote.status || "N/A"}
                </td>
                {/* Actions Column */}
                <td className="px-4 py-2 border-b text-left">
                  <div className="flex space-x-2">
                    {/* PDF Button */}
                
                    {/* View Button */}
                    <Link
                      href={`/admin/quote/pdf/${quote.id}/view`}
                      className="text-blue-500 hover:text-blue-700"
                      title="View Quote"
                    >
                      <FaEye size={18} />
                    </Link>
                
                    {/* Edit Button */}
                    <Link
                      href={`/admin/quote/${quote.id}/edit`}
                      className="text-green-600 hover:text-green-800"
                      title="Edit Quote"
                    >
                      <FaEdit size={18} />
                    </Link>
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(quote.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete Quote"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {currentQuotes.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-2 text-left text-gray-500">
                  No quotes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <nav>
            <ul className="inline-flex -space-x-px">
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i}>
                  <button
                    onClick={() => paginate(i + 1)}
                    className={`px-3 py-2 border ${
                      currentPage === i + 1
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default QuoteListPage;