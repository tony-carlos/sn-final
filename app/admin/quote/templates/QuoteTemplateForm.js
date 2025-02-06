// app/admin/quote/pdf/[quoteId]/view/QuotePDF.js

import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import PropTypes from "prop-types"; // For type checking

// Define styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10, // Base font size
    paddingTop: 40, // Top padding
    paddingBottom: 80, // Bottom padding for footer
    paddingHorizontal: 50, // Horizontal padding
    backgroundColor: "#ffffff", // White background
    color: "#000000", // Black text
  },
  // Header Styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20, // Space below header
    padding: 10,
    border: "1pt solid #997d58", // Border with brand color
    borderRadius: 5,
    backgroundColor: "#f9f9f9", // Light grey background
  },
  refNumber: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
  },
  clientName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
  },
  // Tour Details Styles
  tourDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20, // Space below tour details
    padding: 10,
    border: "1pt solid #997d58", // Border with brand color
    borderRadius: 5,
    backgroundColor: "#f9f9f9", // Light grey background
  },
  detailContainer: {
    width: "23%", // Four items, evenly spaced
  },
  detailLabel: {
    fontSize: 8, // Smaller label font size
    color: "#333333", // Dark grey for labels
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 12, // Larger value font size
    color: "#000000",
    fontWeight: "bold",
  },
  // Title Styles
  title: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000000",
  },
  // Rectangle Box Styles
  rectangleBox: {
    border: "1pt solid #997d58", // Border with brand color
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
    backgroundColor: "#f2f2f2", // Light grey background for distinction
  },
  // Message Box Styles
  messageBox: {
    backgroundColor: "#f2f2f2", // Light grey background
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
  },
  messageText: {
    fontSize: 10,
    color: "#000000",
    marginBottom: 10,
    lineHeight: 1.4,
  },
  // Footer Styles
  footer: {
    position: "absolute",
    bottom: 30, // Positioned 30 units from the bottom
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#cccccc", // Light grey border
    paddingTop: 10,
  },
  footerText: {
    fontSize: 9,
    color: "#333333",
  },
  footerLogo: {
    width: 80, // Adjusted size for better fit
    height: 40,
  },
  // Second Page Styles
  secondPage: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 50,
    backgroundColor: "#ffffff",
    color: "#000000",
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  summaryImage: {
    width: 100, // Small size
    height: 100,
    objectFit: "cover",
    borderRadius: 5,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "right",
    flex: 1,
    marginLeft: 20,
  },
  summaryDates: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333333",
  },
  dateValue: {
    fontSize: 10,
    color: "#000000",
  },
  // Table Styles
  tableContainer: {
    border: "1pt solid #997d58",
    borderRadius: 5,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#997d58",
    padding: 5,
  },
  tableHeaderCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 10,
    fontWeight: "bold",
    color: "#ffffff",
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
    padding: 5,
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    color: "#000000",
    textAlign: "center",
  },
  destinationImage: {
    width: "100%",
    height: "auto",
    borderRadius: 5,
    marginTop: 10,
  },
});

// Helper function to generate map URL using Google Maps Static API
const generateMapURL = (itinerary) => {
  if (!itinerary || !Array.isArray(itinerary) || itinerary.length === 0) {
    return "/map-placeholder.png"; // Provide a default map image or handle accordingly
  }

  // Construct markers
  const markers = itinerary
    .map((item, index) => {
      // Access the 'label' or 'value' from destination
      const destinationLabel = item.destination?.label || item.destination?.value || "";
      return `markers=color:blue%7Clabel:${index + 1}%7C${encodeURIComponent(
        destinationLabel
      )}`;
    })
    .join("&");

  // Construct path
  const path = itinerary
    .map((item) => {
      const destinationLabel = item.destination?.label || item.destination?.value || "";
      return encodeURIComponent(destinationLabel);
    })
    .join("|");

  // Replace 'YOUR_API_KEY' with your actual Google Maps Static API key
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY";

  return `https://maps.googleapis.com/maps/api/staticmap?size=800x600&${markers}&path=color:0x997d58|weight:5|${path}&key=${apiKey}`;
};

// PDF Document Component
const QuotePDF = ({ quote }) => {
  // Debugging: Log the quote data
  console.log("Quote Data:", quote);

  // Validate 'quote' and its properties
  if (!quote) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>Quote data is unavailable.</Text>
        </Page>
      </Document>
    );
  }

  // Extract the first image from destinationsImages
  const firstDestinationImage =
    quote.tourInfo?.destinationsImages && quote.tourInfo.destinationsImages.length > 0
      ? typeof quote.tourInfo.destinationsImages[0] === "object"
        ? quote.tourInfo.destinationsImages[0].url ||
          quote.tourInfo.destinationsImages[0].value ||
          "/default-destination.png"
        : quote.tourInfo.destinationsImages[0]
      : "/default-destination.png"; // Provide a default image path if none

  const mapURL = generateMapURL(quote.itinerary);

  return (
    <Document>
      {/* Page 1: Cover Page */}
      <Page size="A4" style={styles.page}>
        {/* Header: Ref Number and Client Name */}
        <View style={styles.header}>
          <Text style={styles.refNumber}>
            Ref Number: {quote.quoteNumber || "N/A"}
          </Text>
          <Text style={styles.clientName}>
            {quote.clientInfo?.clientName || "Client Name Unavailable"}
          </Text>
        </View>

        {/* Tour Details */}
        <View style={styles.tourDetails}>
          {/* Tour Length */}
          <View style={styles.detailContainer}>
            <Text style={styles.detailLabel}>Tour Length</Text>
            <Text style={styles.detailValue}>
              {quote.totalDays || "N/A"} days
            </Text>
          </View>

          {/* Travelers */}
          <View style={styles.detailContainer}>
            <Text style={styles.detailLabel}>Travelers</Text>
            <Text style={styles.detailValue}>
              {(quote.pricing?.numberOfAdults || 0) +
                (quote.pricing?.numberOfChildren || 0)}
            </Text>
          </View>

          {/* Start Tour */}
          <View style={styles.detailContainer}>
            <Text style={styles.detailLabel}>Start Tour Date</Text>
            <Text style={styles.detailValue}>
              {quote.clientInfo?.startingDay
                ? new Date(quote.clientInfo.startingDay).toLocaleDateString()
                : "N/A"}
            </Text>
          </View>

          {/* End Tour */}
          <View style={styles.detailContainer}>
            <Text style={styles.detailLabel}>End Tour Date</Text>
            <Text style={styles.detailValue}>
              {quote.clientInfo?.endingDay
                ? new Date(quote.clientInfo.endingDay).toLocaleDateString()
                : "N/A"}
            </Text>
          </View>
        </View>

        {/* Tour Title */}
        <Text style={styles.title}>
          {quote.tourInfo?.tourTitle || "Tour Title Unavailable"}
        </Text>

        {/* Rectangle Box: Itinerary Overview */}
        <View style={styles.rectangleBox}>
          <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 10 }}>
            Itinerary Overview
          </Text>
          {quote.itinerary && quote.itinerary.length > 0 ? (
            quote.itinerary.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  marginBottom: 5,
                }}
              >
                <Text style={{ width: "10%", color: "#333333" }}>
                  Day {item.dayNumber}:
                </Text>
                <Text style={{ width: "90%", color: "#000000" }}>
                  {item.destination?.label || item.destination?.value || "N/A"} -{" "}
                  {typeof item.accommodation === "string"
                    ? item.accommodation
                    : item.accommodation?.name || "N/A"}{" "}
                  ({item.mealPlan || "N/A"})
                </Text>
              </View>
            ))
          ) : (
            <Text style={{ color: "#333333" }}>No itinerary details available.</Text>
          )}
        </View>

        {/* Message Box */}
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>
            Dear {quote.clientInfo?.clientName || "Valued Client"},
          </Text>
          <Text style={styles.messageText}>
            We are delighted to send you our custom-made quote for your{" "}
            {quote.tourInfo?.tourTitle || "tour"}. Your tour begins on{" "}
            {quote.clientInfo?.startingDay
              ? new Date(quote.clientInfo.startingDay).toLocaleDateString()
              : "N/A"}{" "}
            in {quote.tourInfo?.startingFrom || "N/A"} and runs over{" "}
            {quote.totalDays || "N/A"} days, ending on{" "}
            {quote.clientInfo?.endingDay
              ? new Date(quote.clientInfo.endingDay).toLocaleDateString()
              : "N/A"}{" "}
            in {quote.tourInfo?.endingFrom || "N/A"}. We feel sure that you will be
            as excited about this safari as we are to have you join us. Please let
            us know if you have any questions.
          </Text>
          <Text style={styles.messageText}>
            We look forward to hearing from you.
          </Text>
          <Text style={styles.messageText}>Best regards,</Text>
          <Text style={styles.messageText}>Serengeti Nexus.</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>serengetinexus.com</Text>
          {/* Logo Image */}
          <Image
            src={quote.tourInfo?.logoUrl || "/logo-light.png"} // Use logo URL from DB or fallback
            style={styles.footerLogo}
            alt="Serengeti Nexus Logo"
          />
        </View>
      </Page>

      {/* Page 2: Summary */}
      <Page size="A4" style={styles.secondPage}>
        {/* Summary Header */}
        <View style={styles.summaryHeader}>
          {/* First Destination Image */}
          <Image
            src={firstDestinationImage} // Ensure this is a valid URL string
            style={styles.summaryImage}
            alt="Destination Image"
          />
          {/* Summary Title */}
          <Text style={styles.summaryTitle}>Summary</Text>
        </View>

        {/* Tour Dates */}
        <View style={styles.summaryDates}>
          {/* Start Tour Date */}
          <View>
            <Text style={styles.dateLabel}>Start Tour Date:</Text>
            <Text style={styles.dateValue}>
              {quote.clientInfo?.startingDay
                ? new Date(quote.clientInfo.startingDay).toLocaleDateString()
                : "N/A"}
            </Text>
          </View>
          {/* End Tour Date */}
          <View>
            <Text style={styles.dateLabel}>End Tour Date:</Text>
            <Text style={styles.dateValue}>
              {quote.clientInfo?.endingDay
                ? new Date(quote.clientInfo.endingDay).toLocaleDateString()
                : "N/A"}
            </Text>
          </View>
        </View>

        {/* Day-by-Day Activities */}
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Days</Text>
            <Text style={styles.tableHeaderCell}>Main Destinations</Text>
            <Text style={styles.tableHeaderCell}>Accommodation</Text>
            <Text style={styles.tableHeaderCell}>Meal Plan</Text>
          </View>
          {/* Table Rows */}
          {quote.itinerary && quote.itinerary.length > 0 ? (
            quote.itinerary.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{`Day ${item.dayNumber}`}</Text>
                <Text style={styles.tableCell}>
                  {item.destination?.label || item.destination?.value || "N/A"}
                </Text>
                <Text style={styles.tableCell}>
                  {typeof item.accommodation === "string"
                    ? item.accommodation
                    : item.accommodation?.name || "N/A"}
                </Text>
                <Text style={styles.tableCell}>{item.mealPlan || "N/A"}</Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell} colSpan={4}>
                No itinerary details available.
              </Text>
            </View>
          )}
        </View>

        {/* Footer for Second Page */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>serengetinexus.com</Text>
          {/* Logo Image */}
          <Image
            src={quote.tourInfo?.logoUrl || "/logo-light.png"} // Use logo URL from DB or fallback
            style={styles.footerLogo}
            alt="Serengeti Nexus Logo"
          />
        </View>
      </Page>
    </Document>
  );
};

// Type Checking with PropTypes
QuotePDF.propTypes = {
  quote: PropTypes.shape({
    quoteNumber: PropTypes.string.isRequired,
    clientInfo: PropTypes.shape({
      clientName: PropTypes.string.isRequired,
      startingDay: PropTypes.string,
      endingDay: PropTypes.string,
    }).isRequired,
    tourInfo: PropTypes.shape({
      tourTitle: PropTypes.string.isRequired,
      startingFrom: PropTypes.string,
      endingFrom: PropTypes.string,
      logoUrl: PropTypes.string, // URL for logo from DB
      destinationsImages: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.string, // Simple URL string
          PropTypes.shape({
            url: PropTypes.string, // Object with 'url'
            label: PropTypes.string,
            value: PropTypes.string,
            images: PropTypes.arrayOf(
              PropTypes.shape({
                storagePath: PropTypes.string,
                url: PropTypes.string,
              })
            ),
          }),
        ])
      ),
    }).isRequired,
    pricing: PropTypes.shape({
      numberOfAdults: PropTypes.number,
      numberOfChildren: PropTypes.number,
    }).isRequired,
    itinerary: PropTypes.arrayOf(
      PropTypes.shape({
        dayNumber: PropTypes.number,
        destination: PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string,
          images: PropTypes.arrayOf(
            PropTypes.shape({
              storagePath: PropTypes.string,
              url: PropTypes.string,
            })
          ),
          lat: PropTypes.number,
          lng: PropTypes.number,
        }),
        accommodation: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.shape({
            name: PropTypes.string, // Adjust based on actual property
            // Add other properties if necessary
          }),
        ]),
        mealPlan: PropTypes.string,
      })
    ),
  }).isRequired,
};

export default QuotePDF;
