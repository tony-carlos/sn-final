import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { submitTour, checkProfileVerified } from "@/lib/api";

const TourForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const isVerified = await checkProfileVerified();
        setVerified(isVerified);

        if (!isVerified) {
          toast.error("Please verify your profile before submitting a tour.");
          router.push("/operator/profile-verification");
        }
      } catch (error) {
        console.error("Verification check error:", error);
      }
    };

    checkVerification();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitTour(formData);
      toast.success("Tour submitted successfully.");
      router.push("/operator/tours/my-tours");
    } catch (error) {
      console.error("Tour submission error:", error);
      toast.error("Failed to submit tour.");
    }
  };

  if (!verified) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Tour Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Tour Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        ></textarea>
      </div>

      <div className="form-group">
        <label>Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          required
        />
      </div>

      <button type="submit" className="submit-btn">Submit Tour</button>
    </form>
  );
};

export default TourForm;
