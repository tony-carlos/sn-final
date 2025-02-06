// /app/tour-packages/list/components/TourPackagesList.js

'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AdminLayout from '@/app/admin/components/AdminLayout';

const TourPackagesList = () => {
  const [tourPackages, setTourPackages] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const router = useRouter();

  const fetchTourPackages = async () => {
    try {
      let q;
      if (filterStatus === 'All') {
        q = collection(db, 'tourPackages');
      } else {
        q = query(
          collection(db, 'tourPackages'),
          where('status', '==', filterStatus)
        );
      }
      const querySnapshot = await getDocs(q);
      const tours = [];
      querySnapshot.forEach((doc) => {
        tours.push({ id: doc.id, ...doc.data() });
      });
      setTourPackages(tours);
    } catch (error) {
      console.error('Error fetching tour packages:', error);
    }
  };

  useEffect(() => {
    fetchTourPackages();
  }, [filterStatus]);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this tour package?')) {
      try {
        await deleteDoc(doc(db, 'tourPackages', id));
        toast.success('Tour package deleted successfully.');
        // Refresh the list after deletion
        fetchTourPackages();
      } catch (error) {
        console.error('Error deleting tour package:', error);
        toast.error('Failed to delete tour package.');
      }
    }
  };

  return (
    <AdminLayout>
    <div>
      {/* Header and Add New Tour Package Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Tour Packages</h1>
        <button
          type="button"
          onClick={() => router.push('/admin/tour-packages/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Add New Tour Package
        </button>
      </div>

      {/* Filter by Status */}
      <div className="flex items-center mb-4">
        <label htmlFor="filterStatus" className="mr-2 font-semibold">
          Filter by Status:
        </label>
        <select
          id="filterStatus"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="All">All</option>
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
        </select>
      </div>

      {/* Tour Packages Table */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-4 py-2 border">S.No</th>
            <th className="px-4 py-2 border">Image</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Destination</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tourPackages.map((tour, index) => (
            <tr key={tour.id}>
              <td className="px-4 py-2 border text-center">{index + 1}</td>
              <td className="px-4 py-2 border">
                {tour.images && tour.images.length > 0 && (
                  <Image
                    src={tour.images[0].url}
                    alt={tour.tourTitle}
                    width={96}
                    height={64}
                    className="object-cover"
                  />
                )}
              </td>
              <td className="px-4 py-2 border">{tour.tourTitle}</td>
              <td className="px-4 py-2 border">{tour.country}</td>
              <td className="px-4 py-2 border">{tour.status}</td>
              <td className="px-4 py-2 border">
                <div className="flex space-x-2">
                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => router.push(`/tour-packages/edit/${tour.id}`)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDelete(tour.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                  {/* View Button */}
                  <button
                    type="button"
                    onClick={() => router.push(`/tour-packages/view/${tour.id}`)}
                    className="text-green-500 hover:text-green-700"
                    title="View"
                  >
                    <FaEye />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </AdminLayout>
  );
};

export default TourPackagesList;
