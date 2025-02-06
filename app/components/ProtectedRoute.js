// components/ProtectedRoute.js
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if the user has a verified email
        if (!user.emailVerified) {
          alert("Please verify your email to access the dashboard.");
          router.push("/operator/login");
          return;
        }

        // Check if the user is an operator and if the profile is verified
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role === "operator") {
            setHasAccess(true);
          } else {
            alert("Access restricted to operators only.");
            router.push("/operator/login");
          }
        } else {
          router.push("/operator/login");
        }
      } else {
        router.push("/operator/login");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (isLoading) return <p>Loading...</p>;
  return hasAccess ? children : null;
};

export default ProtectedRoute;
