// app/admin/accommodations/components/AccommodationRow.js

"use client";

import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";
import Image from "next/image";

const AccommodationRow = ({ accommodation, sno, onDelete }) => {
  return (
    <tr>
      <td className="px-4 py-2 border text-center">{sno}</td>
      <td className="px-4 py-2 border">
        {accommodation.images && accommodation.images.length > 0 ? (
          <Image
            src={accommodation.images[0].url}
            alt={accommodation.name}
            width={100}
            height={80}
            className="object-cover rounded"
          />
        ) : (
          <div className="w-24 h-16 bg-gray-200 flex items-center justify-center rounded">
            No Image
          </div>
        )}
      </td>
      <td className="px-4 py-2 border">{accommodation.name}</td>
      <td className="px-4 py-2 border">{accommodation.title}</td>
      <td className="px-4 py-2 border flex items-center justify-center space-x-2">
        <Link
          href={`/admin/accommodations/${accommodation.slug}/edit`}
          className="text-blue-500 hover:text-blue-700"
          title="Edit Accommodation"
        >
          <FaEdit size={18} />
        </Link>
        <button
          onClick={() => onDelete(accommodation.slug)}
          className="text-red-500 hover:text-red-700"
          title="Delete Accommodation"
        >
          <FaTrash size={18} />
        </button>
      </td>
    </tr>
  );
};

AccommodationRow.propTypes = {
  accommodation: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
        storagePath: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  sno: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default AccommodationRow;
