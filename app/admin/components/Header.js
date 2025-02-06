// app/admin/components/Header.js

'use client';

import React, { useState } from "react";
import Image from "next/image";
import { FaBars, FaTimes } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const Header = ({ setSideBarOpen }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, role } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    // Implement logout logic
  };

  return (
    <>
      <header className="flex items-center justify-between bg-white p-4 shadow-md">
        {/* Header Content */}
      </header>

      {/* Modal for User Profile and Change Password */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="bg-white rounded-lg max-w-md mx-auto p-6 z-10">
            <Dialog.Title className="text-xl font-semibold mb-4">User Profile</Dialog.Title>
            <Dialog.Description className="mb-4">
              <p><strong>Email:</strong> {user?.email || "user@example.com"}</p>
            </Dialog.Description>

            <form>
              {/* Form Fields */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Change Password
              </button>
            </form>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Header;
