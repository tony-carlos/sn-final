import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import sharp from "sharp";
import axios from "axios";
import { db } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

/**
 * Compresses an image from `url` into a base64 data URI, resizing to
 * width ~800px and JPEG ~70% quality.
 */
async function compressImage(url) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const originalBuffer = response.data;

    const compressedBuffer = await sharp(originalBuffer)
      .resize({ width: 800 }) // limit width
      .jpeg({ quality: 70 }) // ~70% quality
      .toBuffer();

    return `data:image/jpeg;base64,${compressedBuffer.toString("base64")}`;
  } catch (err) {
    console.error("compressImage error:", err.message);
    // fallback: return original if compression fails
    return url;
  }
}

export async function GET(request, { params }) {
  const { id } = params;

  try {
    // 1) Fetch from Firestore
    const quoteRef = doc(db, "quotes", id);
    const quoteSnap = await getDoc(quoteRef);

    if (!quoteSnap.exists()) {
      return NextResponse.json({ message: "Quote not found" }, { status: 404 });
    }

    const quote = quoteSnap.data();

    // Shorten ID
    const shortenedId = id.substring(0, 8);
    const quoteNumber = `SN-${shortenedId}`;

    // Deconstruct
    const {
      clientInfo = {},
      tourInfo = {},
      itinerary = [],
      totalDays = 0,
      startingFromCoordinates = { lat: -3.3869254, lng: 36.6829927 },
      endingFromCoordinates = { lat: -3.4245248, lng: 37.0650801 },
      pricing = {},
      paymentTerms = {},
    } = quote;

    // Basic data
    const clientName = clientInfo.clientName || "N/A";
    const startDay = clientInfo.startingDay
      ? new Date(clientInfo.startingDay).toLocaleDateString()
      : "N/A";
    const endDay = clientInfo.endingDay
      ? new Date(clientInfo.endingDay).toLocaleDateString()
      : "N/A";
    const tourTitle = tourInfo.tourTitle || "Untitled Tour";
    const tourDescription = tourInfo.description || "";

    const numberOfAdults = pricing.numberOfAdults || 0;
    const numberOfChildren = pricing.numberOfChildren || 0;
    const startingDestination = tourInfo.startingFrom || "N/A";
    const endingDestination = tourInfo.endingFrom || "N/A";

    // Possibly use 1st itinerary image for page 1 background
    const firstItinerary = itinerary[0] || {};
    let firstImage = firstItinerary?.destination?.images?.[0]?.url || "";
    let tourDescriptionImage = firstImage;

    // COMPRESS MAIN IMAGES
    if (firstImage) {
      firstImage = await compressImage(firstImage);
    }
    if (tourDescriptionImage) {
      tourDescriptionImage = await compressImage(tourDescriptionImage);
    }

    // COMPRESS ALL ITINERARY IMAGES
    for (const day of itinerary) {
      // Destination
      if (day.destination?.images) {
        for (const imgObj of day.destination.images) {
          if (imgObj.url) {
            imgObj.url = await compressImage(imgObj.url);
          }
        }
      }
      // Accommodation
      if (day.accommodation?.images) {
        for (const imgObj of day.accommodation.images) {
          if (imgObj.url) {
            imgObj.url = await compressImage(imgObj.url);
          }
        }
      }
    }

    // Build map coords
    const mapCoordinates = itinerary.map((day) => ({
      lat: day.destination?.lat || startingFromCoordinates.lat,
      lng: day.destination?.lng || startingFromCoordinates.lng,
    }));

    // Build table rows for Day by Day (Page 2)
    const dayRows = itinerary
      .map((day, index) => {
        const mainDestination = day.destination?.label || "N/A";
        const accommodation = day.accommodationName || "(no accommodation)";
        const mealPlan = day.meals?.map((m) => m.label).join(", ") || "N/A";

        return `
          <tr>
            <td>Day ${index + 1}</td>
            <td>${mainDestination}</td>
            <td>${accommodation}</td>
            <td>${mealPlan}</td>
          </tr>
        `;
      })
      .join("");

    // Travel Points (Page 3)
    const dayDestinationAccommodationList = itinerary
      .map((day, index) => {
        const mainDestination = day.destination?.label || "N/A";
        const accommodation = day.accommodationName || "(no accommodation)";
        return `Day ${index + 1}: ${mainDestination} - ${accommodation}`;
      })
      .join("<br>");

    // Detailed Itinerary: build pages for each day
    function buildDetailedItinerary() {
      let startDateObj = null;
      if (clientInfo.startingDay) {
        const d = new Date(clientInfo.startingDay);
        if (!isNaN(d)) {
          startDateObj = d;
        }
      }

      return itinerary
        .map((day, index) => {
          // Date offset
          let dateLabel = "";
          if (startDateObj) {
            const offsetDate = new Date(startDateObj);
            offsetDate.setDate(offsetDate.getDate() + index);
            dateLabel = offsetDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            });
          }

          const dayNumber = index + 1;
          const destinationName = day.destination?.label || "No Destination";
          const activities = day.activities || [];
          const title = day.title || `Day ${dayNumber}`;
          const description = day.description || "";
          const meals = day.meals || [];
          const accommodationName = day.accommodationName || "N/A";
          const accommodationImages = day.accommodation?.images || [];
          const destinationImages = day.destination?.images || [];

          // Activities HTML
          const activitiesHTML = activities
            .map((a) => `<li>${a.activityName || "No Activity"}</li>`)
            .join("");

          // Meals HTML
          const mealsHTML = meals
            .map((m) => `<li>${m.label || "No Meal"}</li>`)
            .join("");

          // Destination images
          const destinationImagesHTML = destinationImages
            .map(
              (img) => `
                <div class="img-wrapper">
                  <img src="${img.url}" alt="${destinationName}" />
                </div>
              `
            )
            .join("");

          // Accommodation images
          const accommodationImagesHTML = accommodationImages
            .map(
              (img) => `
                <div class="img-wrapper">
                  <img src="${img.url}" alt="${accommodationName}" />
                </div>
              `
            )
            .join("");

          return `
            <div class="page itinerary-page">
              <div class="itinerary-content">
                <div class="day-banner">
                  <div class="day-section">
                    <div class="day-box">
                      Day <span class="day-number">${dayNumber}</span>
                    </div>
                    <div class="date-section">
                      ${dateLabel}
                    </div>
                  </div>
                  <div class="location-section">
                    <svg class="location-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    </svg>
                    <span class="location-text">${destinationName}</span>
                  </div>
                </div>

                <div class="itinerary-details">
                  <h3>${title}</h3>
                  <p>${description}</p>

                  <h4>Meals</h4>
                  <ul>${mealsHTML}</ul>

                  <h4>Activities</h4>
                  <ul>${activitiesHTML}</ul>

                  <p>${destinationName}</p>
                  <div class="image-gallery">
                    ${destinationImagesHTML}
                  </div>

                  <p>${accommodationName}</p>
                  <div class="image-gallery">
                    ${accommodationImagesHTML}
                  </div>
                </div>
              </div>
            </div>
          `;
        })
        .join("");
    }

    // Includes/Excludes
    const includesList = (pricing.include || [])
      .map((item) => `<li>${item.value}</li>`)
      .join("");
    const excludesList = (pricing.exclude || [])
      .map((item) => `<li>${item.value}</li>`)
      .join("");

    // Cost breakdown
    const adultPrice = pricing.adultPrice || 0;
    const childPrice = pricing.childPrice || 0;
    const adultTotal = numberOfAdults * adultPrice;
    const childTotal = numberOfChildren * childPrice;
    const subTotal = adultTotal + childTotal;

    // Payment Terms
    const paymentTitle = paymentTerms.title || "Payment Terms";
    const paymentDescription = paymentTerms.description || "";

    // We'll embed a final-page logo as base64
    const finalPageLogo = `data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAcgAAADdCAYAAAA/zeJ2AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAs3lJREFUeJzsfQeYW9WZdjbZTUJ6IwmBJITdhORPSGOTbLLZbNomBLA9Tb1relPXvVfSlXTVe5dmRjNjj22wDYNtcAWDw4Rix5ihOYYYHHDAoZlmirHHntH9z3euNDMGgw24xud9nvNomqRbNOc973e+7/3e9z4CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICglMLnuf/Zfvo6AfvXLXq41s2rvrCn8euv3Drrau/fcetay+9Zd3oJY8++ugnT/UxEhAQEBAQHHeMjo5+YHR0wbkrVgxdsGp0+D9WLe377uji/P+uWTJw+ZrRwfqhlF/JWVoMrEHt99lb+vx067Kwo+1GH9Wy0Wlq6btl/fIfnOpzICAgICAgOO7w2drnObqVA6xRPerokd3kNSluC1gV94Xsqr+i8WjIqtodtCifTTpbXkq5WveFKdVEjFFPRhnNQUSad/1p7bW/OpXHz3Hc+0c57oMjI9yHR0uljy1aVPzs0mzoCwtKwS/D4/z5sY+PjnIfhL87lcdJQEBAQHCGge2V9/lMytdCdvWEzyQ+lHCqJ4te/VTaoazAyLEaPu9U80VWy2ddaj5BSfiMS85nWPVUzNF+7503rTjhBInI7V/DYce5Ubf5kmTAWleIOXRBpqMnSrcxtta6sKOjsY8zKRZ7e2TLnB2i5UynaLXfqFzn6ZWtdXdLlnMmzYi9vTGR91tM6Jibs5xxboIzfjcTcp7H82P/eqKPn4CAgIDgDARShzdmXHo+59bzaYecz7IKRIhSPmGt50uICPvdSj7PSPiiEw1WyhdcIjzilOhQwKK6cWztNd85XsfC8/wHdu/efc6Kq8rncfb2yzirvhhgWtdRXU13u0zS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`;

    // NOW, THE BIG HTML:
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Quote PDF</title>

        <style>
          @page {
            size: A4;
            margin: 0;
          }
          html, body {
            margin: 0; 
            padding: 0;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
            color: #333;
            box-sizing: border-box;
          }
          *, *::before, *::after {
            box-sizing: inherit;
          }

          /* ========== Common Page styles ========== */
          .page {
            width: 100%;
            page-break-after: always;
            padding: 60px 40px 120px 40px;
            background-color: #ffffff;
          }

          /* ========== PAGE 1 (Hero) ========== */
          .page-1 {
            position: relative;
            min-height: 100vh;
            background: url('${firstImage}') no-repeat center center / cover;
            color: #fff;
          }
          .page-1 .overlay {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.4);
          }
          .top-section {
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50px;
            overflow: hidden;
            height: 50px;
            margin-bottom: 20px;
          }
          .top-left {
            display: flex;
            align-items: center;
            flex: 1;
          }
          .proposal-box {
            background-color: #977a50;
            color: #fff;
            padding: 20px 40px;
            font-size: 24px;
            font-weight: bold;
            height: 100%;
            display: flex;
            align-items: center;
          }
          .quote-box {
            color: #fff;
            padding: 0 20px;
            font-size: 16px;
          }
          .client-box {
            color: #fff;
            padding: 0 40px;
            font-size: 16px;
          }
          .tour-info-row {
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            background: rgba(255, 255, 255, 0.2);
            padding: 10px;
            border-radius: 20px;
            margin-bottom: 20px;
            font-size: 14px;
          }
          .hero-title {
            font-size: 1.5rem;
            margin-bottom: 20px;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            width: 100%;
            background: rgba(0, 0, 0, 0.5);
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .intro-message {
            padding: 30px;
            margin-top: 30px;
            line-height: 1.8;
            font-size: 16px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 8px;
          }
          .message-separator {
            border: none;
            border-top: 2px solid #977a50;
            margin: 20px 0;
          }
          .contact-info {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
          }
          .page-1 .contact-info {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
          }
          .page-1 .contact-item {
            display: flex;
            align-items: center;
            gap: 8px;
            flex: 1 1 200px;
          }
          .page-1  .icon-circle {
      width: 40px;
      height: 40px;
      background-color: #f0f0f0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
    }

    /* SVG and "@" Icon Styling */
    .page-1  .icon-circle svg,
    .icon-circle .email-icon {
      width: 20px;
      height: 20px;
      fill: #947b53; /* Applying the desired color */
      color: #947b53; /* For text-based icon */
      font-size: 20px; /* Ensures the "@" symbol is properly sized */
      display: flex;
      align-items: center;
      justify-content: center;
    }

          /* ========== PAGE 2 (Travel Summary) ========== */
          .card {
            background: #fff;
            border-radius: 8px;
            padding: 25px;
            margin-bottom: 15px;
            box-shadow: none;
          }
          .card h2, .card h3, .card h4 {
            margin-top: 0;
            margin-bottom: 12px;
            font-family: 'Georgia', serif;
            color: #977a50;
          }
          .divider {
            border-top: 2px solid #977a50;
            margin: 15px 0 25px;
          }
          .row {
            display: flex;
            align-items: flex-start;
            margin-bottom: 15px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
            font-size: 14px;
          }
          table thead {
            background: #977a50;
            color: #fff;
            border-radius: 8px;
          }
          table th, table td {
            border: 1px solid #977a50;
            padding: 10px;
            text-align: left;
          }
          /* ========== PAGE 3 (Map & Travel Points) ========== */
          .list-info {
            font-size: 12px;
            line-height: 1.4;
          }
          #map {
            width: 100%;
            height: 350px;
            margin: 25px 0;
            border-radius: 8px;
          }
          /* ========== PAGE 4 (Tour Description) ========== */
          .page-4 {
            padding: 0;
          }
          .tour-description-page {
            position: relative;
            width: 100%;
            height: 100vh;
            background: url('${tourDescriptionImage}') no-repeat center center / cover;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .tour-description-page::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.3);
          }
         .tour-description-content {
    position: relative;
    z-index: 2;
    max-width: 800px;
    width: 90%;
    padding: 40px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 12px;
    text-align: justify; /* Added this line */
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    margin: 0 auto; /* Changed from '0 20px' to '0 auto' for better centering */
}
          .tour-description-content h2 {
            font-size: 1.6rem;
            margin-bottom: 20px;
            color: #977a50;
          }
          .tour-description-content p {
            font-size: 1.2rem;
            line-height: 1.6;
            color: #333;
          }

          /* ========== DETAILED ITINERARY pages ========== */
          .itinerary-page {
            /* Additional styling if needed */
          }
          .day-banner {
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: rgba(173, 145, 125, 0.8);
            border-radius: 50px;
            overflow: hidden;
            height: 50px;
            margin-bottom: 20px;
          }
          .day-section {
            display: flex;
            align-items: center;
          }
          .day-box {
            background-color: #977a50;
            color: #fff;
            padding: 20px 40px;
            font-size: 24px;
            font-weight: bold;
            height: 100%;
            display: flex;
            align-items: center;
          }
          .contact-item a.whatsapp-link {
      color: #fff !important; /* Match the icon color and override defaults */
      text-decoration: none !important; /* Remove underline */
    }

    /* Hover Effect for WhatsApp Link */
    .contact-item a.whatsapp-link:hover {
      text-decoration: underline;
    }

          .day-number {
            margin-left: 8px;
            font-size: 18px;
          }
          .date-section {
            color: #fff;
            padding: 0 20px;
            font-size: 16px;
          }
          .location-section {
            display: flex;
            align-items: center;
            padding: 0 25px;
            gap: 8px;
          }
          .location-icon {
            color: #fff;
          }
          .location-text {
            font-weight: bold;
            color: #fff;
          }
          .itinerary-details {
    text-align: justify;
}
          .image-gallery {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 20px;
          }
          .img-wrapper {
            width: 150px;
            height: 100px;
            overflow: hidden;
            border-radius: 8px;
            border: 1px solid #ddd;
          }
          .img-wrapper img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          /* ========== PENULTIMATE PAGE (Pricing) ========== */
          .includes-excludes-row {
            display: flex;
            justify-content: space-between;
            gap: 20px;
          }
          .includes-excludes-row .column {
            flex: 1;
            background: #fff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: none;
          }

          /* ========== FINAL PAGE: Karibu Sana ========== */
          .final-page {
            position: relative;
            min-height: 100vh;
            background: url('${firstImage}') no-repeat center center / cover;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;
            box-sizing: border-box;
          }
          .final-page .overlay {
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,0.4);
          }
          .final-page-content {
            position: relative;
            z-index: 2;
            text-align: center;
            padding: 40px;
            background: rgba(255,255,255,0.2);
            border-radius: 8px;
          }
          .final-page-content h1 {
            font-size: 3.5rem;
            margin-bottom: 20px;
            font-weight: bold;
            letter-spacing: 2px;
            color: #fff;
          }
          .final-page-content p {
            font-size: 1.6rem;
            margin-bottom: 40px;
            color: #fff;
          }
          .final-page-content .logo {
            font-size: 2.5rem;
            font-weight: bold;
            color: #977a50;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .final-page-content .logo img {
            width: 200px;
            height: auto;
            background-color: #fff;
            border-radius: 20px;
            margin-top: 20px;
          }
        </style>

        <!-- LEAFLET CSS -->
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>

      <body>

        <!-- PAGE 1: Hero with firstImage background -->
        <div class="page page-1">
          <div class="overlay"></div>
          <div class="page-1-content" style="position: relative; z-index: 2;">

            <!-- TOP SECTION with left & right layout -->
            <div class="top-section">
              <div class="top-left">
                <div class="proposal-box">Proposal</div>
                <div class="quote-box">${quoteNumber}</div>
              </div>
              <div class="top-right">
                <div class="client-box">${clientName}</div>
              </div>
            </div>

            <!-- Tour info row -->
            <div class="tour-info-row">
              <div>Tour Length: ${totalDays} Days</div>
              <div>Start Tour: ${startDay}</div>
              <div>End Tour: ${endDay}</div>
              <div>
                Travelers: ${numberOfAdults} Adult(s)${
      numberOfChildren ? `, ${numberOfChildren} Child(ren)` : ""
    }
              </div>
            </div>

            <div class="hero-title">${tourTitle}</div>

            <div class="intro-message">
              <p>Dear ${clientName},</p>
              <p>
                We are delighted to present this custom-made quote for your 
                <strong>${tourTitle}</strong>. Your tour starts on 
                <strong>${startDay}</strong> in 
                <strong>${startingDestination}</strong> and runs for 
                <strong>${totalDays}</strong> days, ending on 
                <strong>${endDay}</strong> in 
                <strong>${endingDestination}</strong>.
              </p>
              <p>Please review all details and let us know if you have any questions.</p>
              <p>Best regards,</p>
              <p>Serengeti Nexus.</p>
              <hr class="message-separator">
              <div class="contact-info">
              <div class="contact-item">
      <div class="icon-circle">
        <!-- Phone SVG Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21 11.72 11.72 0 003.68.59 1 1 0 011 1v3.5a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.59 3.68 1 1 0 01-.21 1.11l-2.2 2.2z"/>
        </svg>
      </div>
      <a href="https://wa.me/255759964985" class="whatsapp-link">+255759964985</a>
    </div>
                
    <!-- Email Contact Item -->
    <div class="contact-item">
      <div class="icon-circle">
        <!-- "@" Symbol as Email Icon -->
        <div class="email-icon">@</div>
      </div>
      <span>info@serengetinexus.com</span>
    </div>

    <!-- Website Contact Item -->
    <div class="contact-item">
      <div class="icon-circle">
        <!-- Updated Website SVG Icon (Globe) -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="20px" height="20px" stroke="#947b53" fill="none" stroke-width="3" aria-hidden="true">
          <circle cx="32" cy="32" r="30" />
          <path d="M32 2a30 30 0 0 1 0 60" />
          <path d="M32 2a30 30 0 0 0 0 60" />
          <path d="M2 32h60" />
          <path d="M32 2v60" />
          <path d="M12.12 12.12a30 30 0 0 1 39.76 0" />
          <path d="M12.12 51.88a30 30 0 0 1 39.76 0" />
        </svg>
      </div>
      <span>www.serengetinexus.com</span>
    </div>

    <!-- Address Contact Item -->
    <div class="contact-item">
      <div class="icon-circle">
        <!-- Location Pin SVG Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M12 2C8.13401 2 5 5.13401 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zm0 9.5c-1.38071 0-2.5-1.11929-2.5-2.5S10.6193 6.5 12 6.5s2.5 1.11929 2.5 2.5S13.3807 11.5 12 11.5z"/>
        </svg>
      </div>
      <span>Moshono - Arusha Tanzania</span>
    </div>
              </div>
            </div>
          </div>
        </div>
              </div>
            </div>
          </div>
        </div>

        <!-- PAGE 2: Travel Summary -->
        <div class="page page-2">
          <div class="page-content-light">
            <div class="card">
              <h2>Travel Summary</h2>
              <div class="divider"></div>
              <div class="row" style="align-items:flex-start;">
                <img 
                  src="${firstImage}" 
                  alt="Destination Image" 
                  style="width: 35%; border-radius: 10px; margin-right: 25px;"
                >
                <div style="flex: 1;">
                  <h3 style="margin-bottom: 15px;">${tourTitle}</h3>
                  <p><strong>Starting Day:</strong> ${startDay}</p>
                  <p><strong>Ending Day:</strong> ${endDay}</p>
                  <p><strong>Total Days:</strong> ${totalDays}</p>
                </div>
              </div>
            </div>

            <div class="card">
              <h2>Day by Day Itinerary</h2>
              <table>
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Main Destination</th>
                    <th>Accommodation</th>
                    <th>Meal Plan</th>
                  </tr>
                </thead>
                <tbody>
                  ${dayRows}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- PAGE 3: Map & Travel Points -->
        <div class="page page-3">
          <div class="page-content-light">
            <div class="card">
              <h2>Map of Your Journey</h2>
              <div class="divider"></div>
              <div id="map"></div>
            </div>
            <div class="card">
              <h2>Travel Points</h2>
              <div class="divider"></div>
              <div class="list-info">
                <p><strong>Start Point:</strong> ${startingDestination}</p>
                <p><strong>Day Destinations &amp; Accommodation:</strong><br>
                  ${dayDestinationAccommodationList}
                </p>
                <p><strong>End Point:</strong> ${endingDestination}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- PAGE 4: Tour Description -->
        <div class="page page-4">
          <div class="tour-description-page">
            <div class="tour-description-content">
              <h2>Tour Description</h2>
              <p>${tourDescription}</p>
            </div>
          </div>
        </div>

        <!-- DYNAMIC ITINERARY PAGES -->
        ${buildDetailedItinerary()}

        <!-- PENULTIMATE PAGE: Pricing & Includes/Excludes -->
        <div class="page page-penultimate">
          <div class="page-content-light">
            <div class="card">
              <h2>Pricing & Includes / Excludes</h2>
              <div class="divider"></div>

              <!-- Basic Table -->
              <table>
                <thead>
                  <tr>
                    <th>Tour Length</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Travelers</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>${totalDays} Days</td>
                    <td>${startDay}</td>
                    <td>${endDay}</td>
                    <td>
                      ${numberOfAdults} Adult(s)${
      numberOfChildren ? `, ${numberOfChildren} Child(ren)` : ""
    }
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="includes-excludes-row">
              <div class="column">
                <h3>What’s Included</h3>
                <div class="divider"></div>
                ${
                  includesList
                    ? `<ul>${includesList}</ul>`
                    : "<p>No inclusions listed.</p>"
                }
              </div>
              <div class="column">
                <h3>What’s Excluded</h3>
                <div class="divider"></div>
                ${
                  excludesList
                    ? `<ul>${excludesList}</ul>`
                    : "<p>No exclusions listed.</p>"
                }
              </div>
            </div>

            <div class="card">
              <h2>Cost Breakdown</h2>
              <div class="divider"></div>
             <p><strong>Number of Adults:</strong> ${numberOfAdults} × ${adultPrice.toLocaleString(
      "en-US",
      { style: "currency", currency: "USD" }
    )} = <strong>${adultTotal.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    })}</strong></p>
${
  numberOfChildren
    ? `<p><strong>Number of Children:</strong> ${numberOfChildren} × ${childPrice.toLocaleString(
        "en-US",
        { style: "currency", currency: "USD" }
      )} = <strong>${childTotal.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      })}</strong></p>`
    : ""
}
<p><strong>Subtotal:</strong> <strong>${subTotal.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    })}</strong></p>
            </div>
          </div>
        </div>

        <!-- FINAL PAGE: Karibu Sana -->
        <div class="page final-page">
          <div class="overlay"></div>
          <div class="final-page-content">
            <h1>Karibu Sana!</h1>
            <p>Thank you for choosing Serengeti Nexus.</p>
            <div class="logo">
              <img src="${finalPageLogo}" alt="Serengeti Nexus Logo" />
            </div>
          </div>
        </div>

        <!-- LEAFLET SCRIPTS -->
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet-polylinedecorator/1.1.0/leaflet.polylineDecorator.min.js"></script>
        <script>
          // Initialize the map
          const map = L.map('map').setView([${startingFromCoordinates.lat}, ${
      startingFromCoordinates.lng
    }], 7);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
          }).addTo(map);

          // Start marker
          L.marker([${startingFromCoordinates.lat}, ${
      startingFromCoordinates.lng
    }])
            .addTo(map)
            .bindPopup("Start: ${startingDestination}");

          // Day-by-day markers
          const coords = ${JSON.stringify(mapCoordinates)};
          coords.forEach((coord, i) => {
            const dayLabel = "Day " + (i + 1);
            L.marker([coord.lat, coord.lng]).addTo(map).bindPopup(dayLabel);
          });

          // End marker
          L.marker([${endingFromCoordinates.lat}, ${endingFromCoordinates.lng}])
            .addTo(map)
            .bindPopup("End: ${endingDestination}");

          // Route polyline
          const fullRoute = [
            [${startingFromCoordinates.lat}, ${startingFromCoordinates.lng}],
            ...coords.map(c => [c.lat, c.lng]),
            [${endingFromCoordinates.lat}, ${endingFromCoordinates.lng}]
          ];
          const polyline = L.polyline(fullRoute, {
            color: '#977a50',
            weight: 4,
            opacity: 0.7,
          }).addTo(map);

          // Fit bounds
          map.fitBounds(fullRoute, { padding: [50, 50] });
        </script>
      </body>
      </html>
    `;

    // 2) Puppeteer -> PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      margin: {
        top: "60px",
        right: "40px",
        bottom: "60px",
        left: "40px",
      },
      headerTemplate: `<div></div>`,
      footerTemplate: `
        <style>
          .puppet-footer {
            width: 100%;
            padding: 6px 12px;
            background: #694F5D;
            color: #000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: 'Arial', sans-serif;
            font-size: 10px;
            font-style: italic;
            line-height: 1.2;
          }
          .puppet-footer .left-section {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .puppet-footer .page-info {
            font-size: 10px;
            padding: 2px 4px;
            background: rgba(255,255,255,0.1);
            border-radius: 4px;
          }
          .puppet-footer .quote-info {
            font-size: 10px;
            font-weight: 500;
            letter-spacing: 0.5px;
          }
          .puppet-footer .company-info {
            font-size: 10px;
            font-weight: 500;
            padding: 2px 6px;
            border-radius: 4px;
            background: rgba(255,255,255,0.1);
          }
          .puppet-footer .divider {
            margin: 0 6px;
            opacity: 0.4;
          }
        </style>
        <div class="puppet-footer">
          <div class="left-section">
            <div class="page-info">
              Page <span class="pageNumber"></span> of <span class="totalPages"></span>
            </div>
            <div class="quote-info">
              ${quoteNumber}<span class="divider">|</span>${clientName}
            </div>
          </div>
          <div class="company-info">
            www.serengetinexus.com
          </div>
        </div>
      `,
    });

    await browser.close();

    // Return PDF
    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="quote_${shortenedId}.pdf"`,
      },
    });
  } catch (err) {
    console.error("Error generating PDF:", err);
    return NextResponse.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
}
