// app/admin/accommodations/components/AccommodationsTable.js

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { BiEdit } from "react-icons/bi";
import PropTypes from "prop-types";

const AccommodationsTable = ({ accommodations }) => {
  const router = useRouter();

  return (
    <table className="min-w-full bg-white shadow-md rounded">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b">Name</th>
          <th className="py-2 px-4 border-b">Destination</th>
          <th className="py-2 px-4 border-b">Type</th>
          <th className="py-2 px-4 border-b">Status</th>
          <th className="py-2 px-4 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        {accommodations.map((acc) => (
          <tr key={acc.id} className="hover:bg-gray-100">
            <td className="py-2 px-4 border-b">{acc.name}</td>
            <td className="py-2 px-4 border-b">{acc.title}</td>
            <td className="py-2 px-4 border-b">{acc.levelCategory}</td>
            <td className="py-2 px-4 border-b">{acc.status}</td>
            <td className="py-2 px-4 border-b">
              <div className="flex justify-center space-x-2">
                <BiEdit
                  className="text-blue-500 cursor-pointer"
                  size={20}
                  onClick={() =>
                    router.push(`/admin/accommodations/${acc.slug}`)
                  }
                />
                {/* Add more action icons here if needed */}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

AccommodationsTable.propTypes = {
  accommodations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      levelCategory: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      // Add other necessary properties here
    })
  ).isRequired,
};

export default AccommodationsTable;
