// components/Operator/ProfileForm.js
"use client";
import React, { useState, useEffect } from "react";
import { db, storage } from "@/app/lib/firebase";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation"; 
import { useAuth } from "@/app/hooks/useAuth";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const ProfileForm = ({ isEditMode = false }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: "",
    phoneNumber: "",
    email: "",
    website: "",
    address: "",
    talaCertification: null,
    ownerID: "",
    companyLogo: null,
    profileImage: null,
    shortDescription: "",
    description: "",
    country: "",
    region: "",
    district: "",
    socialLinks: {
      facebook: "",
      twitter: "",
      linkedin: "",
      instagram: "",
      youtube: "",
    },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFormData((prev) => ({
            ...prev,
            companyName: userData.companyName,
            email: userData.email,
          }));

          if (isEditMode) {
            const profileDoc = await getDoc(doc(db, "operatorProfiles", user.uid));
            if (profileDoc.exists()) {
              setFormData((prev) => ({
                ...prev,
                ...profileDoc.data(),
              }));
            }
          }
        }
      }
    };

    fetchCompanyData();
  }, [user, isEditMode]);

  const checkProfileExists = async () => {
    const profileDoc = await getDoc(doc(db, "operatorProfiles", user.uid));
    return profileDoc.exists();
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const profileExists = await checkProfileExists();
      if (profileExists) {
        toast.info("Your profile has already been submitted for review. Please wait for verification.");
        router.push("/operator/dashboard");
        return;
      }

      const logoRef = ref(storage, `logos/${formData.companyLogo?.name}`);
      const certificationRef = ref(storage, `certifications/${formData.talaCertification?.name}`);
      const profileImageRef = ref(storage, `profiles/${formData.profileImage?.name}`);

      const [logoSnapshot, certSnapshot, profileSnapshot] = await Promise.all([
        uploadBytes(logoRef, formData.companyLogo),
        uploadBytes(certificationRef, formData.talaCertification),
        formData.profileImage ? uploadBytes(profileImageRef, formData.profileImage) : null,
      ]);

      const logoUrl = logoSnapshot ? await getDownloadURL(logoSnapshot.ref) : "";
      const certUrl = certSnapshot ? await getDownloadURL(certSnapshot.ref) : "";
      const profileImageUrl = profileSnapshot ? await getDownloadURL(profileSnapshot.ref) : "";

      const profileData = {
        ...formData,
        companyLogo: logoUrl,
        talaCertification: certUrl,
        profileImage: profileImageUrl,
        verificationStatus: "unverified",
        submittedAt: new Date(),
      };

      await addDoc(collection(db, "operatorProfiles"), profileData);
      toast.success("Profile submitted for verification.");
      router.push("/operator/dashboard");
    } catch (error) {
      toast.error("Failed to submit profile. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-3xl mx-auto mt-20">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isEditMode ? "Edit Company Profile" : "Submit Company Profile"}
      </h2>

      {/* Company Name */}
      <div className="mb-6">
        <label className="block font-semibold mb-1">Company Name</label>
        <input
          type="text"
          value={formData.companyName}
          readOnly
          className="p-2 border rounded w-full bg-gray-100 font-bold"
        />
      </div>

      {/* Phone, Email, Website, Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          className="p-2 border rounded w-full"
        />
        <input
          type="text"
          name="website"
          placeholder="Website"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          className="p-2 border rounded w-full"
        />
        <input
          type="text"
          name="address"
          placeholder="Physical Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Location Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          placeholder="Country"
          className="p-2 border rounded w-full"
        />
        <input
          type="text"
          name="region"
          value={formData.region}
          onChange={(e) => setFormData({ ...formData, region: e.target.value })}
          placeholder="Region"
          className="p-2 border rounded w-full"
        />
        <input
          type="text"
          name="district"
          value={formData.district}
          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
          placeholder="District"
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Short Description */}
      <div className="mb-6">
        <label className="block font-semibold mb-1">Short Description</label>
        <input
          type="text"
          name="shortDescription"
          placeholder="Enter a brief description"
          value={formData.shortDescription}
          onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Detailed Description */}
      <div className="mb-6">
        <label className="block font-semibold mb-1">Description</label>
        <CKEditor
          editor={ClassicEditor}
          data={formData.description}
          onChange={(event, editor) => setFormData({ ...formData, description: editor.getData() })}
        />
      </div>

      {/* File Uploads with Placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block font-semibold mb-1">Company Logo</label>
          <input type="file" name="companyLogo" onChange={handleFileChange} className="p-2 border rounded w-full" />
          <p className="text-sm mt-1">{formData.companyLogo ? formData.companyLogo.name : "No file chosen"}</p>
        </div>
        <div>
          <label className="block font-semibold mb-1">TALA Certification</label>
          <input type="file" name="talaCertification" onChange={handleFileChange} className="p-2 border rounded w-full" />
          <p className="text-sm mt-1">{formData.talaCertification ? formData.talaCertification.name : "No file chosen"}</p>
        </div>
        <div>
          <label className="block font-semibold mb-1">Profile Image</label>
          <input type="file" name="profileImage" onChange={handleFileChange} className="p-2 border rounded w-full" />
          <p className="text-sm mt-1">{formData.profileImage ? formData.profileImage.name : "No file chosen"}</p>
        </div>
      </div>

      {/* Social Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          name="facebook"
          placeholder="Facebook URL"
          value={formData.socialLinks.facebook}
          onChange={handleSocialChange}
          className="p-2 border rounded w-full"
        />
        <input
          type="text"
          name="twitter"
          placeholder="Twitter URL"
          value={formData.socialLinks.twitter}
          onChange={handleSocialChange}
          className="p-2 border rounded w-full"
        />
        <input
          type="text"
          name="linkedin"
          placeholder="LinkedIn URL"
          value={formData.socialLinks.linkedin}
          onChange={handleSocialChange}
          className="p-2 border rounded w-full"
        />
        <input
          type="text"
          name="instagram"
          placeholder="Instagram URL"
          value={formData.socialLinks.instagram}
          onChange={handleSocialChange}
          className="p-2 border rounded w-full"
        />
        <input
          type="text"
          name="youtube"
          placeholder="YouTube URL"
          value={formData.socialLinks.youtube}
          onChange={handleSocialChange}
          className="p-2 border rounded w-full"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`${loading ? "bg-gray-500" : "bg-[#F29F67]"} text-white p-2 rounded w-full mt-6 font-semibold`}
      >
        {loading ? "Submitting..." : isEditMode ? "Update Profile" : "Submit for Verification"}
      </button>
    </form>
  );
};

export default ProfileForm;
