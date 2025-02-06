import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";

const useAuth = () => {
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login"); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, [auth, router]);
};

export default useAuth;
