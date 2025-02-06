"use client";

import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import { db } from "@/app/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { toast } from "react-toastify";

export default function TourSingleSidebar({ tour }) {
  const { durationValue } = tour.basicInfo || {};

  const [seasonPricing, setSeasonPricing] = useState({
    adultPrice: 0,
    youthPrice: 0,
  });

  const [adultNumber, setAdultNumber] = useState(1);
  const [youthNumber, setYouthNumber] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    message: "",
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const totalPrice =
    seasonPricing.adultPrice * adultNumber +
    seasonPricing.youthPrice * youthNumber;

  function getCurrentSeason() {
    const now = new Date();
    const month = now.getMonth();
    const day = now.getDate();

    if (
      month === 6 ||
      month === 7 ||
      (month === 11 && day >= 20) ||
      (month === 0 && day <= 10)
    ) {
      return "highSeason";
    }

    if ((month === 3 && day >= 1) || (month === 4 && day <= 19)) {
      return "lowSeason";
    }

    return "midSeason";
  }

  useEffect(() => {
    const currentSeason = getCurrentSeason();
    let adultPrice = 0;
    let youthPrice = 0;

    const { highSeason, lowSeason, midSeason } = tour.pricing.manual;

    if (
      currentSeason === "highSeason" &&
      Array.isArray(highSeason.costs) &&
      highSeason.costs.length > 0
    ) {
      adultPrice = highSeason.costs[0].cost;
      youthPrice = parseFloat((adultPrice * 0.7).toFixed(2));
    } else if (
      currentSeason === "lowSeason" &&
      Array.isArray(lowSeason.costs) &&
      lowSeason.costs.length > 0
    ) {
      adultPrice = lowSeason.costs[0].cost;
      youthPrice = parseFloat((adultPrice * 0.7).toFixed(2));
    } else if (
      currentSeason === "midSeason" &&
      Array.isArray(midSeason.costs) &&
      midSeason.costs.length > 0
    ) {
      adultPrice = midSeason.costs[0].cost;
      youthPrice = parseFloat((adultPrice * 0.7).toFixed(2));
    }

    setSeasonPricing({
      adultPrice,
      youthPrice,
    });
  }, [tour.pricing.manual]);

  useEffect(() => {
    if (startDate && durationValue && !isNaN(durationValue)) {
      const end = new Date(startDate);
      end.setDate(end.getDate() + parseInt(durationValue, 10));
      setEndDate(end);
    } else {
      setEndDate(null);
    }
  }, [startDate, durationValue]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleBookNowClick = () => {
    setError("");

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phoneNumber ||
      !startDate
    ) {
      setError("Please fill in all required fields.");
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsModalOpen(true);
  };

  const handleBookWithSystem = async () => {
    setLoading(true);
    setError("");

    try {
      const bookingData = {
        tourId: tour.id,
        tourTitle: tour.basicInfo.tourTitle,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        adults: adultNumber,
        youths: youthNumber,
        message: formData.message,
        startDate: Timestamp.fromDate(startDate),
        endDate: endDate ? Timestamp.fromDate(endDate) : null,
        totalPrice: parseFloat(totalPrice.toFixed(2)),
        createdAt: Timestamp.now(),
      };

      // Save to Firebase
      const docRef = await addDoc(collection(db, "bookings"), bookingData);

      // Send emails
      const emailResponse = await fetch('/api/send-booking-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        throw new Error(errorData.error || 'Failed to send emails');
      }

      toast.success(
        "Booking successful! Please check your email for confirmation."
      );

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        message: "",
      });
      setStartDate(null);
      setEndDate(null);
      setAdultNumber(1);
      setYouthNumber(0);
      setIsModalOpen(false);

    } catch (err) {
      console.error("Error processing booking: ", err);
      setError(
        "An error occurred while processing your booking. Please try again."
      );
      toast.error("Failed to process your booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppBooking = () => {
    setError("");

    if (!startDate || !endDate) {
      setError("Please select both start and end dates before proceeding.");
      toast.error("Please select both start and end dates before proceeding.");
      return;
    }

    const predefinedMessage = `Dear Serengeti Nexus Team,

I hope this message finds you well. My name is ${
      formData.fullName
    }, and I am interested in booking the ${
      tour.basicInfo.tourTitle
    } from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}.

Booking Details:

Total Price: $${totalPrice.toFixed(2)}
Total Number of People: ${adultNumber + youthNumber}
Adults: ${adultNumber}
Youth (13-17 years): ${youthNumber}

Contact Information:
Email: ${formData.email}
Phone: ${formData.phoneNumber}

Additional Message:
${formData.message}

Please confirm the availability of this tour and provide any necessary steps to finalize the booking. I look forward to your prompt response.

Best regards,

${formData.fullName}
${formData.email}
${formData.phoneNumber}`;

    const whatsappLink = `https://wa.me/255759964985?text=${encodeURIComponent(
      predefinedMessage
    )}`;
    window.open(whatsappLink, "_blank");
    toast.info("Booking details sent via WhatsApp.");
    setIsModalOpen(false);
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="">
      {/* Remove any parent container classes that add max-width or margins */}
      <div
        className={`tourSingleSidebar ${
          isModalOpen ? "filter blur-sm" : ""
        } w-full`}
      >
        <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 w-full">
          <div className="flex items-center justify-between w-full">
            <span className="font-bold text-accent-1 text-lg">From</span>
            <span className="text-2xl text-accent-1 font-semibold">
              ${seasonPricing.adultPrice}
            </span>
          </div>
        </div>

        {/* Ensure w-full and remove max-width classes */}
        <div className="px-4 sm:px-8 py-6 space-y-6 w-full">
          <div className="flex flex-row space-x-4 w-full">
            <div className="flex flex-col flex-1">
              <label htmlFor="startDate" className="mb-1 text-sm font-medium">
                Start Date *
              </label>
              <div className="flex items-center space-x-2">
                <FaCalendarAlt className="text-[#947a57]" size={20} />
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="p-2 border border-[#947a57] rounded w-full"
                  placeholderText="Select Start Date"
                  aria-label="Start Date"
                />
              </div>
            </div>

            <div className="flex flex-col flex-1">
              <label htmlFor="endDate" className="mb-1 text-sm font-medium">
                End Date
              </label>
              <input
                type="text"
                id="endDate"
                name="endDate"
                value={endDate ? endDate.toLocaleDateString() : ""}
                readOnly
                placeholder="End Date"
                className="p-2 border border-[#947a57] rounded w-full bg-gray-100 cursor-not-allowed"
                aria-label="End Date"
              />
            </div>
          </div>

          <div className="space-y-2 w-full">
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-medium">Adult (18+ years)</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setAdultNumber((pre) => (pre > 1 ? pre - 1 : pre))
                  }
                  className="w-6 h-6 bg-accent-1 text-white rounded-full flex items-center justify-center"
                  aria-label="Decrease Adults"
                >
                  -
                </button>
                <span>{adultNumber}</span>
                <button
                  onClick={() => setAdultNumber((pre) => pre + 1)}
                  className="w-6 h-6 bg-accent-1 text-white rounded-full flex items-center justify-center"
                  aria-label="Increase Adults"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-medium">Youth (13-17 years)</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setYouthNumber((pre) => (pre > 0 ? pre - 1 : pre))
                  }
                  className="w-6 h-6 bg-accent-1 text-white rounded-full flex items-center justify-center"
                  aria-label="Decrease Youths"
                >
                  -
                </button>
                <span>{youthNumber}</span>
                <button
                  onClick={() => setYouthNumber((pre) => pre + 1)}
                  className="w-6 h-6 bg-accent-1 text-white rounded-full flex items-center justify-center"
                  aria-label="Increase Youths"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4 w-full">
            <div>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                placeholder="Full Name *"
                className="mt-1 p-2 border border-[#947a57] rounded w-full"
                aria-label="Full Name"
              />
            </div>

            <div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Email Address *"
                className="mt-1 p-2 border border-[#947a57] rounded w-full"
                aria-label="Email Address"
              />
            </div>

            <div>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                placeholder="Phone Number *"
                className="mt-1 p-2 border border-[#947a57] rounded w-full"
                aria-label="Phone Number"
              />
            </div>

            <div>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Message / Special Requests"
                className="mt-1 p-2 border border-[#947a57] rounded w-full"
                rows="3"
                aria-label="Message / Special Requests"
              ></textarea>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Total:</span>
              <span className="font-semibold">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <button
            className="button -sm bg-accent-1 text-white mt-4 flex items-center justify-center p-3 rounded hover:bg-accent-2 transition-colors duration-200 w-full"
            onClick={handleBookNowClick}
            disabled={loading}
          >
            {loading ? "Processing..." : "Book Now"}
            <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 px-4"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="absolute inset-0 bg-black opacity-25"></div>

          <div
            className="bg-white p-6 rounded shadow-lg z-10 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="modal-title"
              className="text-xl font-semibold mb-4 text-center"
            >
              Choose Booking Method
            </h2>
            <div className="space-y-4">
              <button
                onClick={handleWhatsAppBooking}
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors duration-200 flex items-center justify-center"
              >
                Book via WhatsApp
              </button>

              <button
                onClick={handleBookWithSystem}
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors duration-200 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? "Processing..." : "Book via System"}
              </button>
              {/* 
              <button
                onClick={() => {}}
                className="w-full bg-gray-400 text-white py-2 rounded cursor-not-allowed flex items-center justify-center"
                disabled
              >
                Online Payment
              </button> */}
            </div>

            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
