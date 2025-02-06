// app/admin/quote/templates/page.js

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/app/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaUserPlus } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS

const TemplateListPage = () => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "quoteTemplates"));
        const templatesData = querySnapshot.docs.map((doc, index) => ({
          id: doc.id,
          templateNumber: index + 1,
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

  const handleDelete = async (templateId) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      try {
        await deleteDoc(doc(db, "quoteTemplates", templateId));
        setTemplates((prevTemplates) => prevTemplates.filter((t) => t.id !== templateId));
        toast.success("Template deleted successfully.");
      } catch (error) {
        console.error("Error deleting template:", error);
        toast.error("Failed to delete template.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Quote Templates</h1>
      <div className="flex justify-end mb-4">
        <Link
          href="/admin/quote/templates/create"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Create New Template
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">#</th>
              <th className="px-4 py-2 border-b">Tour Title</th>
              <th className="px-4 py-2 border-b">Type of Tour</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((template) => (
              <tr key={template.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b text-center">{template.templateNumber}</td>
                <td className="px-4 py-2 border-b">{template.tourInfo?.tourTitle || "N/A"}</td>
                <td className="px-4 py-2 border-b capitalize">
                  {template.tourInfo?.typeOfTour || "N/A"}
                </td>
                <td className="px-4 py-2 border-b">
                  <div className="flex space-x-2 justify-center">
                    {/* Edit Button */}
                    <Link
                      href={`/admin/quote/templates/${template.id}/edit`}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit Template"
                    >
                      <FaEdit size={18} />
                    </Link>
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete Template"
                    >
                      <FaTrash size={18} />
                    </button>
                    {/* Add New Client Button */}
                    <Link
                      href={`/admin/quote/${template.id}/add-client`}
                      className="text-green-600 hover:text-green-800"
                      title="Add New Client"
                    >
                      <FaUserPlus size={18} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {templates.length === 0 && (
              <tr>
                <td colSpan="4" className="px-4 py-2 text-center text-gray-500">
                  No templates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TemplateListPage;
