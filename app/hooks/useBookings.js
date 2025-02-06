// /app/admin/hooks/useBookings.js

"use client";

import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";

/**
 * Custom hook to manage bookings from Firebase Firestore with pagination.
 *
 * @returns {object} - Contains bookings data, loading state, pagination controls, and functions to delete bookings.
 */
const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [firstDoc, setFirstDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const pageSize = 10; // Number of bookings per page
  const [cursors, setCursors] = useState([]); // Stack to keep track of cursors

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        // Create a query to order bookings by startDate descending and limit to pageSize
        const q = query(
          collection(db, "bookings"),
          orderBy("startDate", "desc"),
          limit(pageSize)
        );

        const snapshot = await getDocs(q);
        const bookingsData = [];
        snapshot.forEach((doc) => {
          bookingsData.push({ id: doc.id, ...doc.data() });
        });

        setBookings(bookingsData);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        setFirstDoc(snapshot.docs[0]);

        // Get total count
        const totalSnapshot = await getDocs(collection(db, "bookings"));
        setTotalBookings(totalSnapshot.size);

        // Reset cursors
        setCursors([null]); // Start with null for the first page
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();

    // Listen to real-time updates (optional)
    const qRealtime = query(
      collection(db, "bookings"),
      orderBy("startDate", "desc"),
      limit(pageSize)
    );

    const unsubscribe = onSnapshot(
      qRealtime,
      (querySnapshot) => {
        const bookingsData = [];
        querySnapshot.forEach((doc) => {
          bookingsData.push({ id: doc.id, ...doc.data() });
        });
        setBookings(bookingsData);
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setFirstDoc(querySnapshot.docs[0]);
      },
      (error) => {
        console.error("Error fetching bookings:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  /**
   * Fetches the next page of bookings.
   */
  const fetchNextPage = async () => {
    if (!lastDoc) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "bookings"),
        orderBy("startDate", "desc"),
        startAfter(lastDoc),
        limit(pageSize)
      );

      const snapshot = await getDocs(q);
      const bookingsData = [];
      snapshot.forEach((doc) => {
        bookingsData.push({ id: doc.id, ...doc.data() });
      });

      setBookings(bookingsData);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setFirstDoc(snapshot.docs[0]);
      setCurrentPage((prev) => prev + 1);

      // Update cursors
      setCursors((prevCursors) => [...prevCursors, lastDoc]);
    } catch (error) {
      console.error("Error fetching next page:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches the previous page of bookings.
   */
  const fetchPreviousPage = async () => {
    if (currentPage === 1) return;
    setLoading(true);
    try {
      const newPage = currentPage - 1;
      const cursor = cursors[newPage - 1]; // Get the cursor for the previous page

      const q = query(
        collection(db, "bookings"),
        orderBy("startDate", "desc"),
        startAfter(cursor),
        limit(pageSize)
      );

      const snapshot = await getDocs(q);
      const bookingsData = [];
      snapshot.forEach((doc) => {
        bookingsData.push({ id: doc.id, ...doc.data() });
      });

      setBookings(bookingsData);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setFirstDoc(snapshot.docs[0]);
      setCurrentPage(newPage);
    } catch (error) {
      console.error("Error fetching previous page:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Deletes a booking by ID.
   *
   * @param {string} id - The ID of the booking to delete.
   */
  const deleteBooking = async (id) => {
    try {
      await deleteDoc(doc(db, "bookings", id));
      // Optionally, update totalBookings
      setTotalBookings((prev) => prev - 1);
    } catch (error) {
      console.error("Error deleting booking:", error);
      throw error;
    }
  };

  return {
    bookings,
    loading,
    currentPage,
    totalBookings,
    pageSize,
    fetchNextPage,
    fetchPreviousPage,
    deleteBooking,
  };
};

export default useBookings;
