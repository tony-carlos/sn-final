// components/SubmitTour.js
"use client";
import React, { useEffect, useState } from "react";
import { auth, db } from "@/app/lib/firebase";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const SubmitTour = () => {
  const [isVerifiedOperator, setIsVerifiedOperator] = useState(false);

  useEffect(() => {
    const checkVerificationStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsVerifiedOperator(userData.verificationStatus === "Verified");
        }
      }
    };

    checkVerificationStatus();
  }, []);

  const handleSubmit = async (tourData) => {
    if (!isVerifiedOperator) {
      toast.error("You must verify your profile to submit tours.");
      return;
    }

    try {
      await addDoc(collection(db, "tours"), { ...tourData, userId: auth.currentUser.uid });
      toast.success("Tour submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit tour.");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Submit a New Tour</h2>
      {isVerifiedOperator ? (
        <form onSubmit={handleSubmit}>
          {/* Tour form fields */}
        </form>
      ) : (
        <p>Please complete profile verification to submit tours.</p>
      )}
    </div>
  );
};

export default SubmitTour;
