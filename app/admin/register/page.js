"use client";

import React, { useState, useEffect } from "react";
import { auth, db } from "@/app/lib/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEmailUnique, setIsEmailUnique] = useState(true);
  const [isCompanyUnique, setIsCompanyUnique] = useState(true);
  const router = useRouter();
  const googleProvider = new GoogleAuthProvider();

  // Define the role variable (default is 'operator')
  const role = "operator";

  const checkEmailAndCompany = async () => {
    const emailQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );
    const emailSnapshot = await getDocs(emailQuery);
    setIsEmailUnique(emailSnapshot.empty);

    const companyQuery = query(
      collection(db, "users"),
      where("companyName", "==", companyName)
    );
    const companySnapshot = await getDocs(companyQuery);
    setIsCompanyUnique(companySnapshot.empty);
  };

  useEffect(() => {
    if (email && companyName) {
      checkEmailAndCompany();
    }
  }, [email, companyName]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    if (!isEmailUnique) {
      toast.error("Email is already registered!");
      setLoading(false);
      return;
    }

    if (!isCompanyUnique) {
      toast.error("Company name is already taken!");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await sendEmailVerification(userCredential.user);

      const userDocRef = doc(db, "users", userCredential.user.uid);
      await setDoc(userDocRef, {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        companyName: companyName,
        role: role, // Using the defined role here
      });

      toast.success("Registration successful! Please verify your email.");
      router.push("/admin/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if email is verified
      if (!user.emailVerified) {
        toast.error("Please verify your email before logging in.");
        router.push("/admin/login");
        return;
      }

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDocs(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          companyName: companyName, // Use a default or prompt for this if needed
          role: role, // Assign the role to the Google user
        });
      }

      toast.success("Login successful!");
      router.push("/admin/dashboard");
    } catch (error) {
      toast.error("Google Sign-In failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="mb-4 text-2xl font-bold">Register</h2>
      <form
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
        onSubmit={handleRegister}
      >
        <input
          type="text"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
          required
        />
        {!isCompanyUnique && (
          <p className="text-red-500 text-sm">Company name is already taken!</p>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
          required
        />
        {!isEmailUnique && (
          <p className="text-red-500 text-sm">Email is already registered!</p>
        )}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded w-full"
            required
          />
          <span
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-2 border rounded w-full"
            required
          />
          <span
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>
        <button
          type="submit"
          className={`w-full p-2 bg-blue-500 text-white rounded ${
            loading ? "opacity-50" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Loading..." : "Register"}
        </button>
        <button
          type="button"
          className={`w-full p-2 bg-red-500 text-white rounded mt-4 ${
            loading ? "opacity-50" : ""
          }`}
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign Up with Google"}
        </button>

        <p className="mt-4">
          Already have an account?{" "}
          <a href="/admin/login" className="text-blue-500">
            Login here
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
