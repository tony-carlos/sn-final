// components/ProtectedAdminRoute.js
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const ProtectedAdminRoute = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().role === "admin") {
          setIsAdmin(true);
        } else {
          router.push("/operator/auth/login"); // Redirect non-admin users to their dashboard
        }
      } else {
        router.push("/admin/login"); // Redirect to login if not authenticated
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <p>Loading...</p>;
  if (!isAdmin) return null;

  return <>{children}</>;
};

export default ProtectedAdminRoute;
