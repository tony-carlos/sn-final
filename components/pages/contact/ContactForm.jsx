// app/components/ContactForm.jsx

"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "dompurify";

/**
 * ContactForm Component
 *
 * Renders a contact form alongside contact information with location, phone, email,
 * social media icons, and a map. Integrates Google reCAPTCHA and React Toastify for notifications.
 *
 * @returns {JSX.Element} - Rendered Contact Form with Contact Information and Map.
 */
const strokeColor = "#947a58";

const CircleIcon = ({ href, src, alt, size = 24, circleSize = 30 }) => (
  <Link href={href} target="_blank" rel="noopener noreferrer">
    <div
      style={{
        width: circleSize,
        height: circleSize,
        borderRadius: "50%",
        border: `2px solid ${strokeColor}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.2s",
      }}
      className="circle-icon"
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

export default function ContactForm() {
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const strokeColor = "#4A90E2"; // Define a stroke color for icons

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
      recaptcha: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(50, "Must be 50 characters or less")
        .required("Name is required"),
      phone: Yup.string()
        .matches(
          /^(\+\d{1,3}[- ]?)?\d{10}$/,
          "Phone number is not valid. It should be 10 digits."
        )
        .required("Phone number is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      message: Yup.string()
        .max(500, "Message must be 500 characters or less")
        .required("Message is required"),
      recaptcha: Yup.string().required(
        "Please verify that you are not a robot"
      ),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success(
            data.message || "Your message has been sent successfully!"
          );
          resetForm();
          setRecaptchaValue(null); // Reset reCAPTCHA
        } else {
          toast.error(
            data.error || "There was an error submitting your message."
          );
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Something went wrong. Please try again later.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Handle reCAPTCHA changes
  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
    formik.setFieldValue("recaptcha", value);
  };

  return (
    <section className="layout-pt-lg layout-pb-lg">
      <div className="container">
        <div className="row justify-center">
          {/* Contact Information Section */}
          <div className="col-lg-4 mb-40">
            <h2 className="text-30 fw-700 text-center mb-30">Contact Us</h2>

            {/* Location */}
            <div className="d-flex align-items-center x-gap-10 mb-20">
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
              <a className="d-block" href="#">
                Moshono Complex, Arusha - Tanzania
              </a>
            </div>

            {/* Email */}
            <div className="d-flex align-items-center x-gap-10 mb-20">
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
              <a className="d-block" href="mailto:info@serengetinexus.com">
                info@serengetinexus.com
              </a>
            </div>

            {/* Phone */}
            <div className="d-flex align-items-center x-gap-10 mb-20">
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
              <a className="d-block" href="tel:+255759964985">
              +255 759 964985
              </a>
            </div>

       
          </div>

          {/* Contact Form Section */}
          <div className="col-lg-8">
            <h2 className="text-30 fw-700 text-center mb-30">
              Leave us your info
            </h2>

            <div className="contactForm">
              <form onSubmit={formik.handleSubmit} className="row y-gap-30">
                {/* Name */}
                <div className="col-md-6">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    className={`w-100 ${
                      formik.touched.name && formik.errors.name
                        ? "input-error"
                        : ""
                    }`}
                    required
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div className="error">{formik.errors.name}</div>
                  ) : null}
                </div>

                {/* Phone */}
                <div className="col-md-6">
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.phone}
                    className={`w-100 ${
                      formik.touched.phone && formik.errors.phone
                        ? "input-error"
                        : ""
                    }`}
                    required
                  />
                  {formik.touched.phone && formik.errors.phone ? (
                    <div className="error">{formik.errors.phone}</div>
                  ) : null}
                </div>

                {/* Email */}
                <div className="col-12">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    className={`w-100 ${
                      formik.touched.email && formik.errors.email
                        ? "input-error"
                        : ""
                    }`}
                    required
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="error">{formik.errors.email}</div>
                  ) : null}
                </div>

                {/* Message */}
                <div className="col-12">
                  <textarea
                    name="message"
                    placeholder="Message"
                    rows="6"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.message}
                    className={`w-100 ${
                      formik.touched.message && formik.errors.message
                        ? "input-error"
                        : ""
                    }`}
                    required
                  ></textarea>
                  {formik.touched.message && formik.errors.message ? (
                    <div className="error">{formik.errors.message}</div>
                  ) : null}
                </div>

                {/* reCAPTCHA Field */}
                <div className="col-12">
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    onChange={handleRecaptchaChange}
                    onExpired={() => setRecaptchaValue(null)}
                  />
                  {formik.touched.recaptcha && formik.errors.recaptcha ? (
                    <div className="error">{formik.errors.recaptcha}</div>
                  ) : null}
                </div>

                {/* Submit Button */}
                <div className="col-12">
                  <button
                    type="submit"
                    className="button -md -dark-1 bg-accent-1 text-white col-12"
                    disabled={formik.isSubmitting}
                  >
                    {formik.isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
