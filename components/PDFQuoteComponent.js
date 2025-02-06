"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  PDFViewer,
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// 1) OPTIONAL: Register custom fonts if you need them
// Example: If you want 'Helvetica Neue', you can add a TTF or OTF source
// Font.register({
//   family: "Helvetica Neue",
//   src: "/fonts/HelveticaNeue.ttf",
//   fontStyle: "normal",
//   fontWeight: "normal",
// });

/**
 * This component is responsible for building the multi-page PDF structure
 * that replicates your original Puppeteer/HTML design.
 *
 * It receives the fully-fetched Firestore quote data as `quote`
 * and also the string `quoteId` for reference.
 */
function QuotePdfDocument({ quote, quoteId }) {
  // 2) Build some derived data (just like your original code)

  // Limit the quote reference to 8 characters
  const shortenedId = quoteId.substring(0, 8);
  const quoteNumber = `SN-${shortenedId}`;

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

  // For Page 1 background image
  const firstItinerary = itinerary[0] || {};
  const firstImage = firstItinerary?.destination?.images?.[0]?.url || "";

  // For Tour Description background image
  const tourDescriptionImage = firstImage || ""; // Same as page 1

  // Includes/Excludes
  const includesList = (pricing.include || []).map((item) => item.value);
  const excludesList = (pricing.exclude || []).map((item) => item.value);

  const adultPrice = pricing.adultPrice || 0;
  const childPrice = pricing.childPrice || 0;
  const adultTotal = numberOfAdults * adultPrice;
  const childTotal = numberOfChildren * childPrice;
  const subTotal = adultTotal + childTotal;

  const paymentTitle = paymentTerms.title || "Payment Terms";
  const paymentDescription = paymentTerms.description || "";

  // Build day-by-day summary table rows
  const dayRows = itinerary.map((day, index) => ({
    dayNumber: index + 1,
    mainDestination: day.destination?.label || "N/A",
    accommodation: day.accommodationName || "(no accommodation)",
    mealPlan: day.meals?.map((m) => m.label).join(", ") || "N/A",
  }));

  // Build Travel Points text
  const dayDestinationAccommodationList = itinerary
    .map((day, index) => {
      const mainDestination = day.destination?.label || "N/A";
      const accommodation = day.accommodationName || "(no accommodation)";
      return `Day ${index + 1}: ${mainDestination} - ${accommodation}`;
    })
    .join("\n");

  // Build Detailed Itinerary
  const buildDetailedItinerary = () => {
    let startDateObj = null;
    if (clientInfo.startingDay) {
      const d = new Date(clientInfo.startingDay);
      if (!isNaN(d)) startDateObj = d;
    }

    return itinerary.map((day, index) => {
      // Calculate date offset
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
      const destinationName = day.destination?.label || "No Destination Name";
      const title = day.title || `Day ${dayNumber}`;
      const description = day.description || "";
      const activities = day.activities || [];
      const meals = day.meals || [];
      const accommodationName = day.accommodationName || "N/A";
      const destinationImages = day.destination?.images || [];
      const accommodationImages = day.accommodation?.images || [];

      return (
        <Page key={`itinerary-day-${index}`} style={styles.page}>
          {/* Example "Day Banner" row */}
          <View style={styles.dayBanner}>
            <View style={styles.daySection}>
              <View style={styles.dayBox}>
                <Text>Day {dayNumber}</Text>
              </View>
              <View style={styles.dateSection}>
                <Text>{dateLabel}</Text>
              </View>
            </View>
            <View style={styles.locationSection}>
              <Text style={styles.locationText}>{destinationName}</Text>
            </View>
          </View>

          {/* Day content */}
          <View style={styles.dayContent}>
            <Text style={styles.dayTitle}>{title}</Text>
            <Text style={styles.dayDescription}>{description}</Text>

            <Text style={styles.sectionHeading}>Meals:</Text>
            {meals.length > 0 ? (
              meals.map((meal, i) => (
                <Text key={`meal-${i}`} style={styles.listItem}>
                  • {meal.label}
                </Text>
              ))
            ) : (
              <Text>N/A</Text>
            )}

            <Text style={styles.sectionHeading}>Activities:</Text>
            {activities.length > 0 ? (
              activities.map((act, i) => (
                <Text key={`act-${i}`} style={styles.listItem}>
                  • {act.activityName}
                </Text>
              ))
            ) : (
              <Text>N/A</Text>
            )}

            <Text style={styles.sectionHeading}>Our Destination</Text>
            <View style={styles.imageRow}>
              {destinationImages.map((img, i) => (
                <Image
                  key={`dest-img-${i}`}
                  src={img.url}
                  style={styles.thumbnailImage}
                />
              ))}
            </View>

            <Text>Our Accommodation: {accommodationName}</Text>
            <View style={styles.imageRow}>
              {accommodationImages.map((img, i) => (
                <Image
                  key={`acc-img-${i}`}
                  src={img.url}
                  style={styles.thumbnailImage}
                />
              ))}
            </View>
          </View>
        </Page>
      );
    });
  };

  return (
    <Document>
      {/* PAGE 1: Proposal / Cover Page */}
      <Page size="A4" style={styles.page1}>
        {/* Background image */}
        {firstImage ? (
          <Image src={firstImage} style={styles.page1Background} />
        ) : null}
        {/* Overlay */}
        <View style={styles.page1Overlay} />

        {/* Content */}
        <View style={styles.page1Content}>
          {/* Top Section */}
          <View style={styles.topSection}>
            <View style={styles.topLeft}>
              <View style={styles.proposalBox}>
                <Text>Proposal</Text>
              </View>
              <View style={styles.quoteBox}>
                <Text>{quoteNumber}</Text>
              </View>
            </View>
            {/* Right side */}
            <View style={styles.clientBox}>
              <Text>{clientName}</Text>
            </View>
          </View>

          {/* Tour Info Row */}
          <View style={styles.tourInfoRow}>
            <Text>Tour Length: {totalDays} Days</Text>
            <Text>Start Tour: {startDay}</Text>
            <Text>End Tour: {endDay}</Text>
            <Text>
              Travelers: {numberOfAdults} Adult(s)
              {numberOfChildren ? `, ${numberOfChildren} Child(ren)` : ""}
            </Text>
          </View>

          <View style={styles.heroTitleWrapper}>
            <Text style={styles.heroTitle}>{tourTitle}</Text>
          </View>

          {/* Intro message */}
          <View style={styles.introMessage}>
            <Text>Dear {clientName},</Text>
            <Text>
              We are delighted to present this custom-made quote for your{" "}
              <Text style={styles.bold}>{tourTitle}</Text>. Your tour starts on{" "}
              <Text style={styles.bold}>{startDay}</Text> in{" "}
              <Text style={styles.bold}>{startingDestination}</Text> and runs
              for <Text style={styles.bold}>{totalDays}</Text> days, ending on{" "}
              <Text style={styles.bold}>{endDay}</Text> in{" "}
              <Text style={styles.bold}>{endingDestination}</Text>.
            </Text>
            <Text>
              Please review all details and let us know if you have any
              questions.
            </Text>
            <Text>Best regards,</Text>
            <Text>Serengeti Nexus</Text>
            {/* contact info, etc. */}
          </View>
        </View>
      </Page>

      {/* PAGE 2: Travel Summary */}
      <Page size="A4" style={styles.page}>
        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>Travel Summary</Text>
          <View style={styles.divider} />
          <View style={styles.row}>
            {firstImage && (
              <Image src={firstImage} style={styles.summaryImage} />
            )}
            <View style={styles.summaryTextBlock}>
              <Text style={styles.summaryTitle}>{tourTitle}</Text>
              <Text>Starting Day: {startDay}</Text>
              <Text>Ending Day: {endDay}</Text>
              <Text>Total Days: {totalDays}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>Day by Day Itinerary</Text>
          <View style={styles.row}>
            <Text>Starting Destination: {startingDestination}</Text>
          </View>

          {/* Table-like layout */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <View style={styles.tableColDay}>
                <Text>Day</Text>
              </View>
              <View style={styles.tableColDest}>
                <Text>Main Destination</Text>
              </View>
              <View style={styles.tableColAcc}>
                <Text>Accommodation</Text>
              </View>
              <View style={styles.tableColMeal}>
                <Text>Meal Plan</Text>
              </View>
            </View>

            {/* Table body */}
            {dayRows.map((row, i) => (
              <View key={`dayRow-${i}`} style={styles.tableRow}>
                <View style={styles.tableColDay}>
                  <Text>Day {row.dayNumber}</Text>
                </View>
                <View style={styles.tableColDest}>
                  <Text>{row.mainDestination}</Text>
                </View>
                <View style={styles.tableColAcc}>
                  <Text>{row.accommodation}</Text>
                </View>
                <View style={styles.tableColMeal}>
                  <Text>{row.mealPlan}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.row}>
            <Text>Ending Destination: {endingDestination}</Text>
          </View>
        </View>
      </Page>

      {/* PAGE 3: Map + Travel Points (Replace map with placeholder if needed) */}
      <Page size="A4" style={styles.page}>
        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>Map of Your Journey</Text>
          <View style={styles.divider} />

          {/* You could fetch a static map image from a service like Google Static Maps, passing lat/lng. */}
          {/* For now, just show a placeholder box or an image. */}
          <View style={styles.mapPlaceholder}>
            <Text>Map Placeholder</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>Travel Points</Text>
          <View style={styles.divider} />
          <Text>
            <Text style={styles.bold}>Start Point:</Text> {startingDestination}
          </Text>
          <Text>
            <Text style={styles.bold}>
              Day Destinations & Accommodation:
            </Text>
          </Text>
          <Text style={styles.multiLine}>{dayDestinationAccommodationList}</Text>

          <Text>
            <Text style={styles.bold}>End Point:</Text> {endingDestination}
          </Text>
        </View>
      </Page>

      {/* PAGE 4: Tour Description with background image */}
      <Page size="A4" style={styles.page4}>
        {tourDescriptionImage ? (
          <Image src={tourDescriptionImage} style={styles.page4Background} />
        ) : null}
        <View style={styles.page4Overlay} />
        <View style={styles.tourDescriptionContent}>
          <Text style={styles.tourDescriptionTitle}>Tour Description</Text>
          <Text style={styles.tourDescriptionText}>{tourDescription}</Text>
        </View>
      </Page>

      {/* DETAILED ITINERARY PAGES */}
      {buildDetailedItinerary()}

      {/* PENULTIMATE PAGE: Pricing & Includes / Excludes */}
      <Page size="A4" style={styles.page}>
        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>Pricing & Includes / Excludes</Text>
          <View style={styles.divider} />

          {/* Basic info table */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <View style={styles.tableCol}>
                <Text>Tour Length</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>Start Date</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>End Date</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>Travelers</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text>{totalDays} Days</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{startDay}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{endDay}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>
                  {numberOfAdults} Adult(s)
                  {numberOfChildren ? `, ${numberOfChildren} Child(ren)` : ""}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Includes / Excludes */}
        <View style={styles.includesExcludesRow}>
          <View style={styles.includesColumn}>
            <Text style={styles.includesTitle}>What’s Included</Text>
            <View style={styles.divider} />
            {includesList.length > 0 ? (
              includesList.map((inc, i) => (
                <Text key={`inc-${i}`} style={styles.listItem}>
                  • {inc}
                </Text>
              ))
            ) : (
              <Text>No inclusions listed.</Text>
            )}
          </View>
          <View style={styles.excludesColumn}>
            <Text style={styles.excludesTitle}>What’s Excluded</Text>
            <View style={styles.divider} />
            {excludesList.length > 0 ? (
              excludesList.map((exc, i) => (
                <Text key={`exc-${i}`} style={styles.listItem}>
                  • {exc}
                </Text>
              ))
            ) : (
              <Text>No exclusions listed.</Text>
            )}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>Cost Breakdown</Text>
          <View style={styles.divider} />
          <Text>
            Number of Adults: {numberOfAdults} × {adultPrice} = {adultTotal}
          </Text>
          {numberOfChildren > 0 && (
            <Text>
              Number of Children: {numberOfChildren} × {childPrice} ={" "}
              {childTotal}
            </Text>
          )}
          <Text>Subtotal: {subTotal}</Text>
          <View style={{ marginTop: 15 }}>
            <Text style={styles.paymentTitle}>{paymentTitle}</Text>
            <Text>{paymentDescription}</Text>
          </View>
        </View>
      </Page>

      {/* FINAL PAGE: Thank You */}
      <Page size="A4" style={styles.finalPage}>
        {/* background (optionally same image) */}
        {firstImage ? (
          <Image src={firstImage} style={styles.finalPageBackground} />
        ) : null}
        <View style={styles.finalPageOverlay} />
        <View style={styles.finalPageContent}>
          <Text style={styles.finalPageHeading}>Karibu Sana!</Text>
          <Text style={styles.finalPageSubheading}>
            Thank you for choosing Serengeti Nexus.
          </Text>

          {/* Example of showing a logo at the bottom */}
          <View style={styles.logoBox}>
            <Image
              src="data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAcgAAADdCAYAAAA..."
              style={styles.logoImage}
            />
          </View>
        </View>
      </Page>
    </Document>
  );
}

/**
 * The main PDF container that fetches data and renders <QuotePdfDocument />.
 * Usage example: In Next.js route or page, you can do
 *
 *   export default function MyPdfPage({ params }) {
 *     return <PDFQuoteComponent quoteId={params.id} />
 *   }
 *
 */
export default function PDFQuoteComponent({ quoteId }) {
  const [quoteData, setQuoteData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuoteData() {
      try {
        const quoteRef = doc(db, "quotes", quoteId);
        const quoteSnap = await getDoc(quoteRef);
        if (quoteSnap.exists()) {
          setQuoteData(quoteSnap.data());
        } else {
          console.log("Quote not found");
        }
      } catch (err) {
        console.error("Error fetching quote:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuoteData();
  }, [quoteId]);

  if (loading) return <div>Loading PDF...</div>;
  if (!quoteData) return <div>No data found for quote {quoteId}</div>;

  // Render PDF in an inline viewer:
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <PDFViewer width="100%" height="100%">
        <QuotePdfDocument quote={quoteData} quoteId={quoteId} />
      </PDFViewer>
    </div>
  );
}

/**
 * Example of styles with @react-pdf/renderer
 * You will need to tweak these to closely match your original design.
 */
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 24,
  },
  bold: {
    fontWeight: "bold",
  },
  multiLine: {
    whiteSpace: "pre-wrap",
  },
  // PAGE 1
  page1: {
    position: "relative",
    backgroundColor: "#FFF",
  },
  page1Background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    left: 0,
    top: 0,
  },
  page1Overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  page1Content: {
    position: "relative",
    flex: 1,
    padding: 40,
    color: "#FFF",
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  topLeft: {
    flexDirection: "row",
  },
  proposalBox: {
    backgroundColor: "#977a50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
  },
  quoteBox: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  clientBox: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tourInfoRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  heroTitleWrapper: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  introMessage: {
    marginTop: 30,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    lineHeight: 1.6,
    fontSize: 12,
  },

  // Page card styles
  sectionCard: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 6,
    borderColor: "#977a50",
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 8,
    color: "#977a50",
    fontWeight: "bold",
  },
  divider: {
    width: "100%",
    height: 2,
    backgroundColor: "#977a50",
    marginVertical: 8,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  summaryImage: {
    width: "35%",
    height: "auto",
    marginRight: 16,
  },
  summaryTextBlock: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "bold",
  },

  // Table
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#977a50",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#977a50",
    color: "#FFF",
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#977a50",
  },
  tableColDay: {
    width: "15%",
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#977a50",
  },
  tableColDest: {
    width: "35%",
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#977a50",
  },
  tableColAcc: {
    width: "30%",
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#977a50",
  },
  tableColMeal: {
    width: "20%",
    padding: 8,
  },
  tableCol: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#977a50",
  },

  // Page 3 map placeholder
  mapPlaceholder: {
    height: 200,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },

  // PAGE 4: Tour Description
  page4: {
    position: "relative",
    backgroundColor: "#FFF",
  },
  page4Background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    left: 0,
    top: 0,
  },
  page4Overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  tourDescriptionContent: {
    position: "relative",
    zIndex: 2,
    margin: 40,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 12,
    padding: 20,
    textAlign: "center",
  },
  tourDescriptionTitle: {
    fontSize: 20,
    marginBottom: 10,
    color: "#977a50",
    fontWeight: "bold",
  },
  tourDescriptionText: {
    fontSize: 12,
    color: "#333",
    lineHeight: 1.6,
  },

  // Detailed Itinerary
  dayBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(173,145,125,0.8)",
    borderRadius: 50,
    alignItems: "center",
    height: 50,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  daySection: {
    flexDirection: "row",
    alignItems: "center",
  },
  dayBox: {
    backgroundColor: "#977a50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
  },
  dateSection: {
    justifyContent: "center",
  },
  locationSection: {
    justifyContent: "center",
  },
  locationText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  dayContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  dayTitle: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: "bold",
    color: "#333",
  },
  dayDescription: {
    fontSize: 12,
    marginBottom: 10,
    color: "#555",
  },
  sectionHeading: {
    marginTop: 10,
    fontWeight: "bold",
  },
  listItem: {
    marginVertical: 2,
  },
  imageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  thumbnailImage: {
    width: 100,
    height: 70,
    objectFit: "cover",
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 5,
  },

  // Includes/Excludes
  includesExcludesRow: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 10,
  },
  includesColumn: {
    flex: 1,
    marginRight: 10,
  },
  excludesColumn: {
    flex: 1,
    marginLeft: 10,
  },
  includesTitle: {
    fontSize: 14,
    color: "#977a50",
    marginBottom: 6,
    fontWeight: "bold",
  },
  excludesTitle: {
    fontSize: 14,
    color: "#977a50",
    marginBottom: 6,
    fontWeight: "bold",
  },

  // Payment
  paymentTitle: {
    fontSize: 14,
    marginBottom: 6,
    color: "#977a50",
    fontWeight: "bold",
  },

  // Final page
  finalPage: {
    position: "relative",
  },
  finalPageBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    left: 0,
    top: 0,
  },
  finalPageOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  finalPageContent: {
    position: "relative",
    zIndex: 2,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  finalPageHeading: {
    fontSize: 32,
    color: "#FFF",
    marginBottom: 20,
    fontWeight: "bold",
  },
  finalPageSubheading: {
    fontSize: 20,
    color: "#FFF",
    marginBottom: 40,
  },
  logoBox: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    padding: 10,
  },
  logoImage: {
    width: 150,
    height: "auto",
  },
});