// app/hooks/useAuth.js
import { useEffect, useState } from "react";
import { auth } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return { user };
};
