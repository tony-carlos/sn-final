// components/Sidebar.js
"use client";
import Link from "next/link";
import Image from "next/image";
import { HomeIcon, MapIcon, ClipboardDocumentCheckIcon, UserCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <aside
      className={`fixed top-0 left-0 h-full ${
        isOpen ? "w-full" : "md:w-64"
      } bg-[#1E1E2C] text-white z-30 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out md:translate-x-0 md:relative`}
    >
      {/* Close button for mobile view */}
      <button onClick={onClose} className="md:hidden text-white p-4 absolute top-4 right-4">
        <XMarkIcon className="h-6 w-6" />
      </button>

      {/* Logo and Dashboard title */}
      <div className="flex flex-col items-center mt-4 md:mt-6">
        <Image src="/logo.png" alt="Logo" width={80} height={80} className="object-contain" />
        <h2 className="text-xl font-bold mt-2">Dashboard</h2>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-4 mt-6">
        <Link href="/operator/dashboard" legacyBehavior>
          <a onClick={onClose} className="flex items-center p-4 hover:bg-gray-700 rounded">
            <HomeIcon className="h-6 w-6 text-[#F29F67] mr-2" /> Dashboard
          </a>
        </Link>
        <Link href="/operator/tours/my-tours" legacyBehavior>
          <a onClick={onClose} className="flex items-center p-4 hover:bg-gray-700 rounded">
            <MapIcon className="h-6 w-6 text-[#F29F67] mr-2" /> My Tours
          </a>
        </Link>
        <Link href="/operator/bookings" legacyBehavior>
          <a onClick={onClose} className="flex items-center p-4 hover:bg-gray-700 rounded">
            <ClipboardDocumentCheckIcon className="h-6 w-6 text-[#F29F67] mr-2" /> Bookings
          </a>
        </Link>
        <Link href="/operator/profile" legacyBehavior>
          <a onClick={onClose} className="flex items-center p-4 hover:bg-gray-700 rounded">
            <UserCircleIcon className="h-6 w-6 text-[#F29F67] mr-2" /> Profile
          </a>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
