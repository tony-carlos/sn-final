"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaMapMarkedAlt,
  FaHotel,
  FaBoxOpen,
  FaQuoteRight,
  FaUserTie,
  FaBook,
  FaHandshake,
  FaBlog,
  FaUsers,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaDashcube, // Icon for Logout
} from "react-icons/fa";
import Header from "./Header"; // Assuming Header is in the same directory

/**
 * AdminLayout Component
 *
 * Renders the admin sidebar with navigation links and wraps around admin pages.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Child components (admin pages).
 */
const AdminLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /**
   * Determines if the current path matches the given path.
   *
   * @param {string} path - The path to check against the current pathname.
   * @returns {boolean} - True if active, else false.
   */
  const isActive = (path) => pathname.startsWith(path);

  // Navigation items with corresponding icons
  const navigationItems = [

    { name: "Dashboard", href: "/admin/dashboard", icon: <FaDashcube /> },
    { name: "Destinations", href: "/admin/destinations", icon: <FaMapMarkedAlt /> },
    { name: "Accommodations", href: "/admin/accommodations", icon: <FaHotel /> },
    { name: "Tour Packages", href: "/admin/tour-packages", icon: <FaBoxOpen /> },
    { name: "Quotes", href: "/admin/quote", icon: <FaQuoteRight /> },
    { name: "Safari Guides", href: "/admin/safariguide", icon: <FaUserTie /> },
    { name: "Bookings", href: "/admin/bookings", icon: <FaBook /> },
    { name: "Customized Request", href: "/admin/customizedrequest", icon: <FaHandshake /> },
    { name: "Blogs", href: "/admin/blogs", icon: <FaBlog /> },
    { name: "Subscribers", href: "/admin/subscribers", icon: <FaUsers /> },
    // Add more navigation items here
    { name: "Logout", href: "/admin/logout", icon: <FaSignOutAlt />, action: "logout" }, // Logout item
  ];

  /**
   * Handles the logout action.
   */
  const handleLogout = () => {
    // Implement your logout logic here.
    // This could involve clearing tokens, making an API call, etc.
    // For demonstration, we'll clear localStorage and redirect to login.

    // Example:
    localStorage.removeItem("authToken");
    // Redirect to login page
    router.push("/login");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed z-30 inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out bg-gray-800 text-white w-64 lg:static lg:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="flex items-center justify-between p-4 bg-gray-900">
          <span className="text-xl font-bold">Admin Panel</span>
          <button
            className="lg:hidden text-gray-400 hover:text-white focus:outline-none"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <nav className="mt-4">
          <ul>
            {navigationItems.map((item) => (
              <li key={item.name}>
                {item.action === "logout" ? (
                  <button
                    onClick={handleLogout}
                    className={`flex items-center w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors ${
                      isActive(item.href) ? "bg-gray-700" : ""
                    }`}
                    aria-label="Logout"
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 hover:bg-gray-700 transition-colors ${
                      isActive(item.href) ? "bg-gray-700" : ""
                    }`}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header setSideBarOpen={setIsSidebarOpen} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-100">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
