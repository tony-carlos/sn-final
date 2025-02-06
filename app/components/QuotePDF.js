import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Link,
} from "@react-pdf/renderer";
import { registerFonts } from "@/app/lib/fonts";

// Register fonts
registerFonts();

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
  },
  section: {
    marginBottom: 20,
  },
  // Header styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
    padding: 10,
  },
  proposalBox: {
    backgroundColor: "#977a50",
    padding: "10px 20px",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  quoteBox: {
    color: "#333",
    padding: "0 10px",
    fontSize: 12,
  },
  clientBox: {
    color: "#333",
    padding: "0 20px",
    fontSize: 12,
  },
  // Tour info styles
  tourInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 10,
  },
  heroTitle: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#977a50",
    textTransform: "uppercase",
  },
  // Content styles
  text: {
    fontSize: 10,
    marginBottom: 5,
    fontFamily: "Helvetica",
  },
  boldText: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "Helvetica",
  },
  // Table styles
  table: {
    display: "table",
    width: "auto",
    marginBottom: 20,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#977a50",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#977a50",
  },
  tableHeader: {
    backgroundColor: "#977a50",
    color: "white",
    padding: 5,
    fontSize: 10,
    fontWeight: "bold",
  },
  tableCell: {
    padding: 5,
    fontSize: 9,
    borderRightWidth: 1,
    borderRightColor: "#977a50",
  },
  // Image styles
  image: {
    width: "100%",
    height: 200,
    objectFit: "cover",
    marginBottom: 10,
  },
  imageGallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },
  imageWrapper: {
    width: "45%",
    height: 100,
  },
  // Card styles
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#977a50",
    marginVertical: 10,
  },
  // Footer styles
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#666",
    fontSize: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  // Additional styles from previous implementation
  pageContent: {
    position: "relative",
    zIndex: 2,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  introMessage: {
    padding: 20,
    marginTop: 20,
    lineHeight: 1.8,
    fontSize: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
  },
  contactInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    minWidth: 200,
  },
  iconCircle: {
    width: 20,
    height: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },
  dayBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(173, 145, 125, 0.8)",
    borderRadius: 25,
    height: 25,
    marginBottom: 10,
    padding: 5,
  },
  daySection: {
    flexDirection: "row",
    alignItems: "center",
  },
  dayBox: {
    backgroundColor: "#977a50",
    color: "white",
    padding: 10,
    fontSize: 12,
    fontWeight: "bold",
    height: "100%",
    alignItems: "center",
  },
  dateSection: {
    color: "white",
    padding: "0 10px",
    fontSize: 10,
  },
  locationSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: "0 12px",
    gap: 4,
  },
  locationText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  includesExcludesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  column: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
  },
  tourDescriptionPage: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  tourDescriptionContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: 400,
    width: "90%",
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 12,
    margin: "0 auto",
  },
  finalPageContent: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
  },
  finalPageTitle: {
    fontSize: 28,
    marginBottom: 10,
    fontWeight: "bold",
    letterSpacing: 1,
    color: "white",
  },
  logo: {
    width: 100,
    height: "auto",
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 10,
  },
  // Map styles
  map: {
    width: "100%",
    height: 320,
    marginVertical: 12,
    borderRadius: 8,
  },
  // Additional page styles
  page1: {
    position: "relative",
    minHeight: "100vh",
    color: "#fff",
  },
  page1Content: {
    position: "relative",
    zIndex: 2,
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 50,
    height: 50,
    marginBottom: 20,
  },
  topLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  messageSeparator: {
    borderTopWidth: 2,
    borderTopColor: "#977a50",
    marginVertical: 10,
  },
  // Enhanced typography
  heading1: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#977a50",
  },
  heading2: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#977a50",
  },
  heading3: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#977a50",
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.6,
    marginBottom: 10,
  },
  // List styles
  list: {
    marginLeft: 15,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 10,
    lineHeight: 1.6,
    marginBottom: 5,
  },
  // Enhanced image styles
  roundedImage: {
    borderRadius: 8,
    overflow: "hidden",
  },
  imageShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  // Enhanced card styles
  cardHeader: {
    borderBottomWidth: 2,
    borderBottomColor: "#977a50",
    paddingBottom: 10,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#977a50",
  },
  // Price styles
  priceTag: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#977a50",
    marginTop: 10,
  },
  priceDetail: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  // Contact styles
  contactTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  contactLink: {
    color: "#977a50",
    textDecoration: "none",
  },
  // Background styles
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  // Enhanced table styles
  enhancedTable: {
    borderWidth: 1,
    borderColor: "#977a50",
    borderRadius: 8,
    overflow: "hidden",
    marginVertical: 15,
  },
  enhancedTableHeader: {
    backgroundColor: "#977a50",
    padding: 12,
  },
  enhancedTableHeaderText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  enhancedTableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#977a50",
    padding: 10,
  },
  enhancedTableCell: {
    flex: 1,
    padding: 8,
    fontSize: 10,
  },
  // Status styles
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
  },
});

const QuotePDF = ({ quote }) => {
  const {
    clientInfo,
    tourInfo,
    itinerary,
    totalDays,
    pricing,
    quoteNumber,
    startingDestination,
    endingDestination,
    startingFromCoordinates,
    endingFromCoordinates,
  } = quote;

  // Helper function to format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Helper function to get image URL with cache busting
  const getImageUrl = (url) => {
    if (!url) return null;
    const timestamp = new Date().getTime();
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}t=${timestamp}`;
  };

  // Helper function to get first valid image URL from an array
  const getFirstImageUrl = (images) => {
    if (!images || !Array.isArray(images) || images.length === 0) return null;
    return getImageUrl(images[0].url);
  };

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={[styles.page, styles.page1]}>
        {itinerary[0]?.destination?.images && (
          <Image
            src={getFirstImageUrl(itinerary[0].destination.images)}
            style={styles.backgroundImage}
            cache={false}
          />
        )}
        <View style={styles.overlay} />
        <View style={styles.page1Content}>
          <View style={styles.topSection}>
            <View style={styles.topLeft}>
              <View style={styles.proposalBox}>
                <Text>Proposal</Text>
              </View>
              <Text style={styles.quoteBox}>{quoteNumber}</Text>
            </View>
            <Text style={styles.clientBox}>{clientInfo.clientName}</Text>
          </View>

          <View style={styles.tourInfo}>
            <Text style={styles.text}>Tour Length: {totalDays} Days</Text>
            <Text style={styles.text}>
              Start Tour: {formatDate(clientInfo.startingDay)}
            </Text>
            <Text style={styles.text}>
              End Tour: {formatDate(clientInfo.endingDay)}
            </Text>
            <Text style={styles.text}>
              Travelers: {pricing.numberOfAdults} Adult(s)
              {pricing.numberOfChildren
                ? `, ${pricing.numberOfChildren} Child(ren)`
                : ""}
            </Text>
          </View>

          <Text style={styles.heading1}>{tourInfo.tourTitle}</Text>

          <View style={styles.introMessage}>
            <Text style={styles.boldText}>Dear {clientInfo.clientName},</Text>
            <Text style={styles.paragraph}>
              We are delighted to present this custom-made quote for your{" "}
              {tourInfo.tourTitle}. Your tour starts on{" "}
              {formatDate(clientInfo.startingDay)} in {startingDestination}
              and runs for {totalDays} days, ending on{" "}
              {formatDate(clientInfo.endingDay)} in {endingDestination}.
            </Text>
            <Text style={styles.paragraph}>
              Please review all details and let us know if you have any
              questions.
            </Text>
            <Text style={styles.paragraph}>Best regards,</Text>
            <Text style={styles.paragraph}>Serengeti Nexus</Text>

            <View style={styles.messageSeparator} />

            <View style={styles.contactInfo}>
              <View style={styles.contactItem}>
                <View style={styles.iconCircle}>
                  <Text>📞</Text>
                </View>
                <Text style={styles.text}>+255759964985</Text>
              </View>
              <View style={styles.contactItem}>
                <View style={styles.iconCircle}>
                  <Text>@</Text>
                </View>
                <Text style={styles.text}>info@serengetinexus.com</Text>
              </View>
              <View style={styles.contactItem}>
                <View style={styles.iconCircle}>
                  <Text>🌐</Text>
                </View>
                <Text style={styles.text}>www.serengetinexus.com</Text>
              </View>
              <View style={styles.contactItem}>
                <View style={styles.iconCircle}>
                  <Text>📍</Text>
                </View>
                <Text style={styles.text}>Moshono - Arusha Tanzania</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>

      {/* Tour Description Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.tourDescriptionPage}>
          <View style={styles.overlay} />
          <View style={styles.tourDescriptionContent}>
            <Text style={styles.heading2}>Tour Description</Text>
            <Text style={styles.paragraph}>{tourInfo.description}</Text>
          </View>
        </View>
      </Page>

      {/* Travel Summary Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Travel Summary</Text>
          </View>
          <View style={[styles.row, { alignItems: "flex-start" }]}>
            {itinerary[0]?.destination?.images?.[0]?.url && (
              <Image
                src={`${itinerary[0].destination.images[0].url}&size=800x600`}
                style={[styles.roundedImage, { width: "35%", marginRight: 12 }]}
              />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.heading3}>{tourInfo.tourTitle}</Text>
              <Text style={styles.text}>
                Starting Day: {formatDate(clientInfo.startingDay)}
              </Text>
              <Text style={styles.text}>
                Ending Day: {formatDate(clientInfo.endingDay)}
              </Text>
              <Text style={styles.text}>Total Days: {totalDays}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Day by Day Itinerary</Text>
          </View>
          <View style={styles.enhancedTable}>
            <View style={styles.enhancedTableHeader}>
              <View style={[styles.enhancedTableRow, { borderBottomWidth: 0 }]}>
                <View style={[styles.enhancedTableCell, { flex: 1 }]}>
                  <Text style={styles.enhancedTableHeaderText}>Day</Text>
                </View>
                <View style={[styles.enhancedTableCell, { flex: 2 }]}>
                  <Text style={styles.enhancedTableHeaderText}>
                    Main Destination
                  </Text>
                </View>
                <View style={[styles.enhancedTableCell, { flex: 2 }]}>
                  <Text style={styles.enhancedTableHeaderText}>
                    Accommodation
                  </Text>
                </View>
                <View style={[styles.enhancedTableCell, { flex: 2 }]}>
                  <Text style={styles.enhancedTableHeaderText}>Meal Plan</Text>
                </View>
              </View>
            </View>
            {itinerary.map((day, index) => (
              <View key={index} style={styles.enhancedTableRow}>
                <View style={[styles.enhancedTableCell, { flex: 1 }]}>
                  <Text>Day {index + 1}</Text>
                </View>
                <View style={[styles.enhancedTableCell, { flex: 2 }]}>
                  <Text>{day.destination?.label || "N/A"}</Text>
                </View>
                <View style={[styles.enhancedTableCell, { flex: 2 }]}>
                  <Text>{day.accommodationName || "(no accommodation)"}</Text>
                </View>
                <View style={[styles.enhancedTableCell, { flex: 2 }]}>
                  <Text>
                    {day.meals?.map((meal) => meal.label).join(", ") || "N/A"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Page>

      {/* Itinerary Detail Pages */}
      {itinerary.map((day, index) => (
        <Page key={index} size="A4" style={styles.page}>
          <View style={styles.dayBanner}>
            <View style={styles.daySection}>
              <View style={styles.dayBox}>
                <Text>Day {index + 1}</Text>
              </View>
              <Text style={styles.dateSection}>
                {formatDate(
                  new Date(clientInfo.startingDay).setDate(
                    new Date(clientInfo.startingDay).getDate() + index
                  )
                )}
              </Text>
            </View>
            <View style={styles.locationSection}>
              <Text style={styles.locationText}>
                {day.destination?.label || "No Destination"}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.heading3}>
              {day.title || `Day ${index + 1}`}
            </Text>
            <Text style={styles.paragraph}>{day.description}</Text>

            <View style={styles.divider} />

            <Text style={styles.heading3}>Activities:</Text>
            <View style={styles.list}>
              {day.activities?.map((activity, i) => (
                <Text key={i} style={styles.listItem}>
                  • {activity.activityName}
                </Text>
              ))}
            </View>

            <View style={styles.divider} />

            <Text style={styles.heading3}>Meals:</Text>
            <View style={styles.list}>
              {day.meals?.map((meal, i) => (
                <Text key={i} style={styles.listItem}>
                  • {meal.label}
                </Text>
              ))}
            </View>

            <View style={styles.divider} />

            <Text style={styles.heading3}>Accommodation:</Text>
            <Text style={styles.paragraph}>{day.accommodationName}</Text>

            {/* Destination Images */}
            {day.destination?.images && day.destination.images.length > 0 && (
              <View style={styles.imageGallery}>
                <Image
                  src={getFirstImageUrl(day.destination.images)}
                  style={[styles.imageWrapper, styles.roundedImage]}
                  cache={false}
                />
              </View>
            )}

            {/* Accommodation Images */}
            {day.accommodation?.images &&
              day.accommodation.images.length > 0 && (
                <View style={styles.imageGallery}>
                  <Image
                    src={getFirstImageUrl(day.accommodation.images)}
                    style={[styles.imageWrapper, styles.roundedImage]}
                    cache={false}
                  />
                </View>
              )}
          </View>
        </Page>
      ))}

      {/* Cost Breakdown Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Cost Breakdown</Text>
          </View>

          <View style={styles.enhancedTable}>
            <View style={styles.enhancedTableHeader}>
              <View style={[styles.enhancedTableRow, { borderBottomWidth: 0 }]}>
                <View style={[styles.enhancedTableCell, { flex: 2 }]}>
                  <Text style={styles.enhancedTableHeaderText}>
                    Description
                  </Text>
                </View>
                <View style={[styles.enhancedTableCell, { flex: 1 }]}>
                  <Text style={styles.enhancedTableHeaderText}>Amount</Text>
                </View>
              </View>
            </View>

            <View style={styles.enhancedTableRow}>
              <View style={[styles.enhancedTableCell, { flex: 2 }]}>
                <Text>
                  Adults ({pricing.numberOfAdults} ×{" "}
                  {formatCurrency(pricing.adultPrice)})
                </Text>
              </View>
              <View style={[styles.enhancedTableCell, { flex: 1 }]}>
                <Text>
                  {formatCurrency(pricing.numberOfAdults * pricing.adultPrice)}
                </Text>
              </View>
            </View>

            {pricing.numberOfChildren > 0 && (
              <View style={styles.enhancedTableRow}>
                <View style={[styles.enhancedTableCell, { flex: 2 }]}>
                  <Text>
                    Children ({pricing.numberOfChildren} ×{" "}
                    {formatCurrency(pricing.childPrice)})
                  </Text>
                </View>
                <View style={[styles.enhancedTableCell, { flex: 1 }]}>
                  <Text>
                    {formatCurrency(
                      pricing.numberOfChildren * pricing.childPrice
                    )}
                  </Text>
                </View>
              </View>
            )}

            <View
              style={[styles.enhancedTableRow, { backgroundColor: "#f8f8f8" }]}
            >
              <View style={[styles.enhancedTableCell, { flex: 2 }]}>
                <Text style={styles.boldText}>Total</Text>
              </View>
              <View style={[styles.enhancedTableCell, { flex: 1 }]}>
                <Text style={styles.boldText}>
                  {formatCurrency(
                    pricing.numberOfAdults * pricing.adultPrice +
                      pricing.numberOfChildren * pricing.childPrice
                  )}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.includesExcludesRow}>
          <View style={styles.column}>
            <Text style={styles.heading3}>What's Included</Text>
            <View style={styles.divider} />
            <View style={styles.list}>
              {pricing.include?.map((item, index) => (
                <Text key={index} style={styles.listItem}>
                  • {item.value}
                </Text>
              ))}
            </View>
          </View>
          <View style={styles.column}>
            <Text style={styles.heading3}>What's Excluded</Text>
            <View style={styles.divider} />
            <View style={styles.list}>
              {pricing.exclude?.map((item, index) => (
                <Text key={index} style={styles.listItem}>
                  • {item.value}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </Page>

      {/* Final Page */}
      <Page size="A4" style={[styles.page, styles.page1]}>
        <View style={styles.overlay} />
        <View style={styles.finalPageContent}>
          <Text style={styles.finalPageTitle}>Karibu Sana!</Text>
          <Text style={[styles.text, { color: "white" }]}>
            Thank you for choosing Serengeti Nexus.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>Quote Reference: {quoteNumber}</Text>
          <Text>www.serengetinexus.com</Text>
          <Text>
            Page{" "}
            <Text
              render={({ pageNumber, totalPages }) =>
                `${pageNumber} of ${totalPages}`
              }
            />
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default QuotePDF;
