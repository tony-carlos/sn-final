// components/AccountSettingsModal.js
"use client";

import React, { useState, useEffect } from "react";
import { auth, db } from "@/app/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AccountSettingsModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    phone: "",
    email: "",
    website: "",
    physicalAddress: "",
    TALA: "",
    ownerID: "",
    logoURL: "",
    shortDescription: "",
    fullDescription: "",
    country: "",
  });
  const [status, setStatus] = useState("unverified"); // Default status
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setFormData(userData);
          setStatus(userData.status || "unverified");
        }
      }
    };
    fetchUserData();
  }, []);

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.companyName) {
      newErrors.companyName = "Company Name is required";
      valid = false;
    }
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "A valid 10-digit phone number is required";
      valid = false;
    }
    if (!formData.email || !/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)) {
      newErrors.email = "A valid email is required";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please correct the errors.");
      return;
    }

    try {
      const userDoc = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDoc, {
        ...formData,
        status: "unverified", // Set to unverified upon submission
        submittedBy: auth.currentUser.uid,
      });
      toast.success("Profile submitted for verification.");
      onClose();
    } catch (error) {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-lg p-6 rounded">
        <h2 className="text-xl font-bold mb-4">Account Settings</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="companyName"
            value={formData.companyName || ""}
            onChange={handleChange}
            placeholder="Company Name"
            className="w-full p-2 mb-4 border rounded"
          />
          {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName}</p>}

          <input
            type="text"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full p-2 mb-4 border rounded"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 mb-4 border rounded"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <input
            type="text"
            name="website"
            value={formData.website || ""}
            onChange={handleChange}
            placeholder="Website"
            className="w-full p-2 mb-4 border rounded"
          />

          <input
            type="text"
            name="physicalAddress"
            value={formData.physicalAddress || ""}
            onChange={handleChange}
            placeholder="Physical Address"
            className="w-full p-2 mb-4 border rounded"
          />

          <input
            type="text"
            name="TALA"
            value={formData.TALA || ""}
            onChange={handleChange}
            placeholder="TALA Certification"
            className="w-full p-2 mb-4 border rounded"
          />

          <input
            type="text"
            name="ownerID"
            value={formData.ownerID || ""}
            onChange={handleChange}
            placeholder="Passport/National ID"
            className="w-full p-2 mb-4 border rounded"
          />

          <input
            type="file"
            name="logoURL"
            onChange={(e) => setFormData((prev) => ({ ...prev, logoURL: e.target.files[0] }))}
            className="w-full p-2 mb-4 border rounded"
          />

          <textarea
            name="shortDescription"
            value={formData.shortDescription || ""}
            onChange={handleChange}
            placeholder="Short Description"
            className="w-full p-2 mb-4 border rounded"
          />

          <textarea
            name="fullDescription"
            value={formData.fullDescription || ""}
            onChange={handleChange}
            placeholder="Full Description"
            className="w-full p-2 mb-4 border rounded"
          />

          <input
            type="text"
            name="country"
            value={formData.country || ""}
            onChange={handleChange}
            placeholder="Country"
            className="w-full p-2 mb-4 border rounded"
          />

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Submit for Verification
            </button>
          </div>
        </form>
        <p className="mt-4 text-sm">
          Status:{" "}
          <span className={`font-bold ${status === "verified" ? "text-green-500" : "text-yellow-500"}`}>
            {status}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AccountSettingsModal;
