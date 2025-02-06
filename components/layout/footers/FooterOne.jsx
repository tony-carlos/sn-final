"use client";

import React, { useState } from "react";
import FooterLinks from "../components/FooterLinks";
import Image from "next/image";
import Link from "next/link";
import useSafariguide from "@/app/hooks/useSafariguide"; // Updated hook
import { CircularProgress, Alert, Typography, IconButton } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

// Firebase imports
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";
// Toastify imports
import { toast } from "react-toastify";

// Common stroke color for icons
const strokeColor = "#947a58";

// Reusable SquareIcon component with rounded corners
const SquareIcon = ({ href, src, alt, size = 24, squareSize = 50 }) => (
  <Link href={href} target="_blank" rel="noopener noreferrer" aria-label={alt}>
    <div
      style={{
        width: squareSize,
        height: squareSize,
        borderRadius: "10px", // Rounded corners
        border: `2px solid ${strokeColor}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.2s, background-color 0.2s",
        backgroundColor: "#f5f5f5", // Light background for better visibility
      }}
      className="square-icon"
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        style={{ objectFit: "contain" }}
      />
    </div>
  </Link>
);

export default function FooterOne() {
  const { safariguides, loading, error } = useSafariguide(); // Updated hook
  const [email, setEmail] = useState("");

  // Email validation regex
  const validateEmail = (email) => {
    // Simple email regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };



  // Handle Subscribe button click
  const handleSubscribe = async () => {
    if (!email) {
      toast.error("Please enter an email address.");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      // Check if email already exists
      const subscribersRef = collection(db, "subscribers");
      const q = query(subscribersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Email already subscribed
        toast.info("This email is already subscribed.");
        return;
      }

      // Add the email to 'subscribers' collection
      await addDoc(subscribersRef, {
        email: email,
        createdAt: serverTimestamp(),
      });

      toast.success("Subscribed successfully!");
      setEmail(""); // Clear the input
    } catch (err) {
      console.error("Error subscribing:", err);
      toast.error("Failed to subscribe. Please try again later.");
    }
  };

  return (
    <>
      <footer className="footer -type-1">
        <div className="footer__main">
          {/* Background Image */}
          <div className="footer__bg">
            <Image
              width={1800}
              height={627}
              src="/img/footer/1/bg.svg"
              alt="footer background"
              priority
            />
          </div>

          <div className="container">
            {/* ====================== CENTERED SUBSCRIBE SECTION ====================== */}
            <div
              className="footer__subscribeWrapper d-flex flex-column align-items-center justify-content-center"
              style={{ marginTop: "40px", marginBottom: "40px" }}
            >
              <h4 className="text-20 fw-500 mb-10">Newsletter</h4>
              <p className="mb-20 text-center">
                Subscribe to our free newsletter and stay up to date
              </p>
              <div
                className="footer__newsletter d-flex align-items-center justify-content-center"
                style={{
                  borderRadius: "200px",
                  overflow: "hidden",
                  border: "1px solid #ccc",
                  padding: "4px",
                  maxWidth: "500px",
                  width: "100%",
                }}
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    border: "none",
                    outline: "none",
                    padding: "10px",
                    flexGrow: 1,
                  }}
                />
                <button
                  onClick={handleSubscribe}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#947a57",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Subscribe Now
                </button>
              </div>
            </div>

            {/* ======================= FOOTER CONTENT ====================== */}
            <div className="footer__content">
              <div className="row y-gap-40 justify-between">
                {/* CONTACT COLUMN */}
                <div className="col-lg-3 col-md-6">
                  <h4 className="text-20 fw-500 mb-20">Contact</h4>

                  {/* LOCATION */}
                  <div className="d-flex align-items-center x-gap-10 mb-10">
                    <div style={{ display: "flex" }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          border: `2px solid ${strokeColor}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          marginRight: 8,
                        }}
                      >
                        <Image
                          src="/icons/location-pin-svgrepo-com.svg"
                          alt="Location Icon"
                          width={20}
                          height={20}
                        />
                      </div>
                    </div>
                    <a className="d-block" href="#">
                      Moshono Complex, Arusha - Tanzania
                    </a>
                  </div>

                  {/* EMAIL */}
                  <div className="d-flex align-items-center x-gap-10 mb-10">
                    <div style={{ display: "flex" }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          border: `2px solid ${strokeColor}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          marginRight: 8,
                        }}
                      >
                        <Image
                          src="/icons/email-svgrepo-com.svg"
                          alt="Email Icon"
                          width={20}
                          height={20}
                        />
                      </div>
                    </div>
                    <a
                      className="d-block"
                      href="mailto:info@serengetinexus.com"
                    >
                      info@serengetinexus.com
                    </a>
                  </div>

                  {/* PHONE */}
                  <div className="d-flex align-items-center x-gap-10">
                    <div style={{ display: "flex" }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          border: `2px solid ${strokeColor}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          marginRight: 8,
                        }}
                      >
                        <Image
                          src="/icons/phone-calling-svgrepo-com.svg"
                          alt="Phone Icon"
                          width={20}
                          height={20}
                        />
                      </div>
                    </div>
                    <a className="d-block" href="tel:+255759964985">
                      +255759964985
                    </a>
                  </div>

                  {/* ====================== CONNECT WITH US SECTION ====================== */}
                  <div className="footer__connectWithUs mt-20">
                    <h4 className="text-20 fw-500 mb-10">Connect With Us</h4>
                    <div className="social-media-icons d-flex flex-wrap justify-content-start">
                      {/* Instagram */}
                      <div className="social-icon">
                        <SquareIcon
                          href="https://www.instagram.com/serengetinexus/"
                          src="/icons/instagram-2016-5.svg"
                          alt="Instagram"
                          size={24}
                          squareSize={50}
                        />
                      </div>
                      {/* YouTube */}
                      <div className="social-icon">
                        <SquareIcon
                          href="https://youtube.com/@serengetinexus?si=gawYphoGckQHGHHg"
                          src="/icons/youtube-icon-5.svg"
                          alt="YouTube"
                          size={24}
                          squareSize={50}
                        />
                      </div>
                      {/* TikTok */}
                      <div className="social-icon">
                        <SquareIcon
                          href="https://www.tiktok.com/@serengetinexus?_t=ZM-8sPCvfLDpwb&_r=1"
                          src="/icons/tiktok-icon-2.svg"
                          alt="TikTok"
                          size={24}
                          squareSize={50}
                        />
                      </div>
                      {/* Pinterest */}
                      <div className="social-icon">
                        <SquareIcon
                          href="https://www.pinterest.com/serengetinexus"
                          src="/icons/pinterest-3.svg"
                          alt="Pinterest"
                          size={24}
                          squareSize={50}
                        />
                      </div>
                    </div>
                  </div>
                  {/* ====================== END OF CONNECT WITH US SECTION ====================== */}
                </div>

                {/* FOOTER LINKS (existing component) */}
                <FooterLinks />

                {/* SAFARIGUIDE COLUMN */}
                <div className="col-lg-3 col-md-6">
                  <h4 className="text-20 fw-500">Travel Guides</h4>
                  {/* Handle Loading State */}
                  {loading && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "10px 0",
                      }}
                    >
                      <CircularProgress size={24} />
                    </div>
                  )}

                  {/* Handle Error State */}
                  {error && (
                    <Alert severity="error">
                      Failed to load Travel Guides.
                    </Alert>
                  )}

                  {/* Display Safariguides */}
                  {!loading && !error && safariguides.length > 0 && (
                    <ul className="footer__travelGuidesList mt-20">
                      {safariguides.slice(0, 3).map((guide) => (
                        <li key={guide.id} className="footer__travelGuidesItem">
                          <Link href={`/safariguide/${guide.slug}`}>
                            {guide.title}
                          </Link>
                        </li>
                      ))}
                      {safariguides.length > 3 && (
                        <li className="footer__travelGuidesItem">
                          <Link href="/safariguide">More</Link>
                        </li>
                      )}
                    </ul>
                  )}

                  {/* Handle Empty State */}
                  {!loading && !error && safariguides.length === 0 && (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mt: 2 }}
                    >
                      No Travel Guides Available.
                    </Typography>
                  )}
                </div>
              </div>
            </div>

            {/* ====================== ADDITIONAL SOCIAL MEDIA SECTION ====================== */}
            <div className="footer__additionalSocialMedia mb-40 d-flex flex-column align-items-center">
              <h4 className="text-20 fw-500 mb-20">Reviews & Partners </h4>
              <div className="additional-social-media-icons d-flex flex-wrap justify-content-center">
                {/* Google */}
                <div className="social-icon">
                  <SquareIcon
                    href="https://g.page/r/CRpX3KYLSlu-EAI/review"
                    src="/icons/google-g-2015.svg"
                    alt="Google Reviews"
                    size={24}
                    squareSize={50}
                  />
                </div>
                {/* Trustpilot */}
                <div className="social-icon">
                  <SquareIcon
                    href="https://www.trustpilot.com/review/serengetinexus.com"
                    src="/icons/trustpilot-2.svg"
                    alt="Trustpilot"
                    size={24}
                    squareSize={50}
                  />
                </div>
                {/* Add Trustpilot Widget */}
                
                {/* Add more additional social media links here if needed */}
              </div>
            </div>
            {/* ====================== END OF ADDITIONAL SOCIAL MEDIA SECTION ====================== */}
          </div>
        </div>

        {/* ======================= FOOTER BOTTOM ====================== */}
        <div className="container">
          <div className="footer__bottom py-20">
            <div className="row y-gap-5 justify-center items-center">
              {/* Center the footer text */}
              <div className="col-auto text-center">
                <div>©Serengeti Nexus {new Date().getFullYear()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================= TOAST CONTAINER ====================== */}
        {/* The ToastContainer is already included in the root layout */}
      </footer>
      <a
        href="https://api.whatsapp.com/send?phone=255759964985" // Corrected link
        className="floating-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconButton color="inherit">
          <WhatsAppIcon style={{ fontSize: 40, color: "white" }} />
        </IconButton>
      </a>

      <style jsx>{`
        .welcome-message {
          text-align: center;
          margin: 20px 0;
        }

        .floating-whatsapp {
          position: fixed;
          right: 20px;
          bottom: 80px;
          background-color: #25d366;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
          z-index: 1000;
        }

        .floating-whatsapp:hover {
          background-color: #20c359;
        }

        .footerSocials__icons a {
          margin: 0 10px;
        }

        .available-links {
          list-style: none;
          padding: 0;
        }

        .available-links li {
          margin-bottom: 10px;
        }

        .available-links a {
          color: #000;
          text-decoration: none;
          transition: color 0.3s;
        }

        .available-links a:hover {
          color: #eb662b;
        }

        .icon-link {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: black;
        }

        .icon-wrapper {
          display: flex;
          align-items: center;
        }

        .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #eb662b;
          color: white;
          text-align: center;
          line-height: 40px;
          transition: background-color 0.3s, color 0.3s;
          margin-right: 10px;
        }

        .icon:hover {
          background-color: #eb662b;
          color: white;
        }

        .icon .icon {
          font-size: 20px;
        }

        .icon-text {
          color: black;
        }

        .footer__content .text-20 {
          color: black;
        }

        /* ====== Connect With Us Section ====== */
        .footer__connectWithUs {
          margin-top: 20px;
        }

        .footer__connectWithUs h4 {
          margin-bottom: 10px;
        }

        .social-media-icons {
          display: flex;
          gap: 15px;
        }

        .social-icon {
          width: 50px;
          height: 50px;
          background-color: #f5f5f5;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s, transform 0.3s;
        }

        .social-icon:hover {
          background-color: #e0e0e0;
          transform: translateY(-5px);
        }

        .social-icon img {
          width: 24px;
          height: 24px;
        }

        /* ====== Additional Social Media Section ====== */
        .footer__additionalSocialMedia {
          padding: 20px 0;
          border-top: 1px solid #ccc;
        }

        .footer__additionalSocialMedia h4 {
          margin-bottom: 20px;
        }

        .additional-social-media-icons {
          display: flex;
          gap: 15px;
        }

        /* ====== End of Additional Social Media Section ====== */

        /* Responsive Design */
        @media (max-width: 768px) {
          .footer__content .row {
            flex-direction: column;
            align-items: center;
          }

          .footer__connectWithUs .social-media-icons,
          .footer__additionalSocialMedia .additional-social-media-icons {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .social-icon {
            width: 40px;
            height: 40px;
          }

          .social-icon img {
            width: 20px;
            height: 20px;
          }

          .footer__subscribeWrapper {
            margin-top: 20px;
            margin-bottom: 20px;
          }

          .footer__newsletter {
            max-width: 300px;
          }

          .footer__connectWithUs,
          .footer__additionalSocialMedia {
            padding: 15px 0;
          }
        }
        /* ====== End of Responsive Design ====== */
      `}</style>
    </>
  );
}
