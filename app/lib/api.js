// app/lib/api.js
import { db, storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, doc, getDoc, updateDoc, query, where, getDocs } from "firebase/firestore";

// Upload profile verification with uploaded logo
export const uploadProfileVerification = async (formData, userId) => {
  const logoRef = ref(storage, `logos/${formData.companyLogo.name}`);
  await uploadBytes(logoRef, formData.companyLogo);
  const logoUrl = await getDownloadURL(logoRef);

  const profileData = {
    ...formData,
    userId, 
    companyLogo: logoUrl,
    verificationStatus: "Pending",
  };

  await addDoc(collection(db, "operatorVerifications"), profileData);
};

// Fetch operator data for the specific user
export const getOperatorData = async (userId) => {
  const operatorRef = doc(db, "operators", userId);
  const docSnap = await getDoc(operatorRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    throw new Error("No operator data found.");
  }
};

// Check if profile is verified for the operator
export const checkProfileVerified = async (userId) => {
  const operatorRef = doc(db, "operators", userId);
  const docSnap = await getDoc(operatorRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    return data.verificationStatus === "Verified";
  } else {
    throw new Error("No operator data found.");
  }
};

// Submit a new tour by the operator
export const submitTour = async (tourData) => {
  await addDoc(collection(db, "tours"), tourData);
};

// Fetch all tours for the specific user
export const getMyTours = async (userId) => {
  const q = query(collection(db, "tours"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Fetch all bookings for the specific user
export const getMyBookings = async (userId) => {
  const q = query(collection(db, "bookings"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
