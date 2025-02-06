"use client"; // Ensure this is a client-side component

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Grid,
  Modal,
  Slide,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Image from "next/image"; // Use Next.js Image for optimization
import styles from "./ItineraryDisplay.module.css"; // Import CSS Module

/**
 * Helper function to construct image URLs from Firestore image objects.
 * Handles both 'url' and 'storagePath' fields.
 *
 * @param {Object} image - Image object containing either 'url' or 'storagePath'.
 * @param {string} bucket - Firebase Storage bucket name.
 * @returns {string|null} - Constructed image URL or null if invalid.
 */
const constructImageURL = (image, bucket) => {
  if (!image) return null;
  if (image.url) {
    return image.url; // Use the URL directly without additional encoding
  } else if (image.storagePath) {
    // Encode the storagePath only once
    return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(
      image.storagePath
    )}?alt=media`;
  }
  return null;
};

/**
 * Helper function to extract destination name from destination object
 * @param {Object|null} destination - The destination field from itinerary item
 * @returns {string} - The extracted destination name or a default message
 */
const getDestinationName = (destination) => {
  if (!destination) return "Unknown Destination";

  // If destination has a 'label' field
  if (destination.label) return destination.label;

  // If destination has a 'destinationName' field
  if (destination.destinationName) return destination.destinationName;

  // Add more conditions if your data has different structures

  return "Unknown Destination";
};

/**
 * Helper function to extract accommodation name from accommodation field
 * @param {Array|Object|null} accommodation - Accommodation data
 * @returns {string} - The extracted accommodation name or a default message
 */
const getAccommodationName = (accommodation) => {
  if (!accommodation) return "No Accommodation Provided";

  if (Array.isArray(accommodation) && accommodation.length > 0) {
    // Assuming each accommodation object has a 'label'
    return accommodation[0].label || "No Accommodation Provided";
  } else if (typeof accommodation === "object" && accommodation !== null) {
    // If accommodation is a single object
    return accommodation.label || "No Accommodation Provided";
  }

  return "No Accommodation Provided";
};

/**
 * Itinerary Component
 *
 * Renders the itinerary details for a tour.
 */
const Itinerary = ({ tour }) => {
  const [open, setOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Destructure itinerary from tour with a fallback to an empty array
  const { itinerary = [] } = tour || {};

  useEffect(() => {
    console.log("Itinerary Data:", itinerary);
  }, [itinerary]);

  const handleOpen = (image) => {
    setModalImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setModalImage("");
  };

  // If itinerary is not an array or is empty, display a fallback message
  if (!Array.isArray(itinerary) || itinerary.length === 0) {
    return (
      <Typography variant="h6" color="textSecondary">
        No itinerary available for this tour.
      </Typography>
    );
  }

  return (
    <div className={styles.roadmapContainer}>
      <div className={styles.roadmap}>
        {itinerary.map((item, index) => {
          // Destructure required fields with default values
          const {
            title = `Day ${index + 1}`,
            description = "No description available.",
            photo = "",
            time = "",
            distance = "",
            maxAltitude = "",
            accommodation = {},
            destination = {},
            meals = [],
          } = item;

          // Use helper functions to get names
          const destinationName = getDestinationName(destination);
          const accommodationName = getAccommodationName(accommodation);

          // Determine the image to display: use 'photo' or first 'destination.images'
          const displayPhoto =
            photo ||
            (destination.images &&
              destination.images.length > 0 &&
              constructImageURL(
                destination.images[0],
                process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-firebase-bucket"
              ));

          console.log(`Itinerary Item ${index + 1} Title:`, title);
          console.log(`Itinerary Item ${index + 1} Destination Name:`, destinationName);

          // Prepare information items including "Meals" for all devices
          const infoItems = [
            {
              label: "Accommodation",
              value: accommodationName,
            },
            { label: "Destination", value: destinationName },
            {
              label: "Meals",
              value: meals.length > 0 ? meals.map((meal) => meal.label).join(", ") : null,
            },
          ];

          return (
            <Accordion
              key={index} // Ideally, use a unique identifier like item.id
              defaultExpanded={false}
              style={{ marginBottom: "10px" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index + 1}-content`}
                id={`panel${index + 1}-header`}
                sx={{ display: "flex", alignItems: "center" }} // Ensure alignment
              >
                {/* Icon with spacing */}
                <Box sx={{ display: "flex", alignItems: "center", marginRight: "16px" }}>
                  {index !== itinerary.length - 1 ? (
                    index === 0 ? (
                      <div className={styles.roadmapIconBig}>
                        <i className="icon-pin" aria-hidden="true"></i>
                      </div>
                    ) : (
                      <div className={styles.roadmapIcon}></div>
                    )
                  ) : (
                    <div className={styles.roadmapIconBig}>
                      <i className="icon-flag" aria-hidden="true"></i>
                    </div>
                  )}
                </Box>

                {/* Title */}
                <Box>
                  <div className={styles.roadmapWrap}>
                    <Typography variant="subtitle1">{title}</Typography>
                  </div>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {/* Image Section */}
                  <Grid item xs={12} md={4}>
                    {displayPhoto ? (
                      <Image
                        src={displayPhoto}
                        alt={`${title} Photo`}
                        width={850}
                        height={510}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "400px",
                          borderRadius: "10px",
                          cursor: "pointer",
                          objectFit: "cover",
                        }}
                        onClick={() => handleOpen(displayPhoto)}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/fallback.jpg"; // Ensure this image exists in your public folder
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "400px",
                          backgroundColor: "#e0e0e0",
                          borderRadius: "10px",
                        }}
                      ></div>
                    )}
                  </Grid>

                  {/* Details Section */}
                  <Grid item xs={12} md={8}>
                    <Typography
                      style={{
                        paddingBottom: 1,
                        lineHeight: "24px",
                        textAlign: "justify", // Justify the description content
                      }}
                      dangerouslySetInnerHTML={{ __html: description }}
                    />

                    <Divider />

                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box sx={{ mt: 2 }}>
                          {/* Conditional Rendering Based on Screen Size */}
                          {isMobile ? (
                            <>
                              {time && (
                                <div style={{ marginBottom: "8px" }}>
                                  <Typography variant="body2" style={{ color: "red" }}>
                                    Time:{" "}
                                    <span style={{ color: "black" }}>
                                      {time} {typeof time === "number" ? "hours" : ""}
                                    </span>
                                  </Typography>
                                </div>
                              )}
                              {distance && (
                                <div style={{ marginBottom: "8px" }}>
                                  <Typography variant="body2" style={{ color: "red" }}>
                                    Distance:{" "}
                                    <span style={{ color: "black" }}>
                                      {distance} {typeof distance === "number" ? "km" : ""}
                                    </span>
                                  </Typography>
                                </div>
                              )}
                              {maxAltitude && (
                                <div style={{ marginBottom: "8px" }}>
                                  <Typography variant="body2" style={{ color: "red" }}>
                                    Max Altitude:{" "}
                                    <span style={{ color: "black" }}>
                                      {maxAltitude} {typeof maxAltitude === "number" ? "m" : ""}
                                    </span>
                                  </Typography>
                                </div>
                              )}
                              {meals.length > 0 && (
                                <div style={{ marginBottom: "8px" }}>
                                  <Typography variant="body2" style={{ color: "red" }}>
                                    Meals:{" "}
                                    <span style={{ color: "black" }}>
                                      {meals.map((meal) => meal.label).join(", ")}
                                    </span>
                                  </Typography>
                                </div>
                              )}
                            </>
                          ) : (
                            <div style={{ marginBottom: "8px" }}>
                              {time && (
                                <Typography variant="body2" style={{ display: "inline", color: "red" }}>
                                  Time:{" "}
                                  <span style={{ color: "black" }}>
                                    {time} {typeof time === "number" ? "hours" : ""}
                                  </span>
                                </Typography>
                              )}
                              {(time && (distance || maxAltitude || meals.length > 0)) && (
                                <Typography variant="body2" style={{ display: "inline" }}>
                                  {" "}
                                  |{" "}
                                </Typography>
                              )}
                              {distance && (
                                <Typography variant="body2" style={{ display: "inline", color: "red" }}>
                                  Distance:{" "}
                                  <span style={{ color: "black" }}>
                                    {distance} {typeof distance === "number" ? "km" : ""}
                                  </span>
                                </Typography>
                              )}
                              {(distance && (maxAltitude || meals.length > 0)) && (
                                <Typography variant="body2" style={{ display: "inline" }}>
                                  {" "}
                                  |{" "}
                                </Typography>
                              )}
                              {maxAltitude && (
                                <Typography variant="body2" style={{ display: "inline", color: "red" }}>
                                  Max Altitude:{" "}
                                  <span style={{ color: "black" }}>
                                    {maxAltitude} {typeof maxAltitude === "number" ? "m" : ""}
                                  </span>
                                </Typography>
                              )}
                              {maxAltitude && meals.length > 0 && (
                                <Typography variant="body2" style={{ display: "inline", color: "red" }}>
                                  {" "}
                                  |{" "}
                                  Meals:{" "}
                                  <span style={{ color: "black" }}>
                                    {meals.map((meal) => meal.label).join(", ")}
                                  </span>
                                </Typography>
                              )}
                            </div>
                          )}

                          {/* Display Accommodation, Destination, Meals */}
                          {infoItems.map(
                            (info, idx) =>
                              info.value && (
                                <div
                                  key={idx}
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginBottom: "8px",
                                  }}
                                >
                                  <Typography variant="body2" style={{ color: "red", margin: "0" }}>
                                    {info.label}:
                                  </Typography>
                                  <Typography variant="body2">{info.value}</Typography>
                                </div>
                              )
                          )}
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Accommodation Images */}
                    {accommodation.images && accommodation.images.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          <strong>Accommodation Images:</strong>
                        </Typography>
                        <Grid container spacing={1}>
                          {accommodation.images.map((image, imgIndex) => {
                            const imageURL = constructImageURL(
                              image,
                              process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-firebase-bucket"
                            );
                            return imageURL ? (
                              <Grid item key={imgIndex}>
                                <Image
                                  src={imageURL}
                                  alt={`Accommodation Image ${imgIndex + 1}`}
                                  width={80}
                                  height={60}
                                  style={{
                                    width: "80px",
                                    height: "60px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleOpen(imageURL)}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/images/fallback.jpg"; // Ensure this image exists in your public folder
                                  }}
                                />
                              </Grid>
                            ) : (
                              <Grid item key={imgIndex}>
                                <div
                                  style={{
                                    width: "80px",
                                    height: "60px",
                                    backgroundColor: "#e0e0e0",
                                    borderRadius: "8px",
                                  }}
                                ></div>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>

      {/* Image Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Slide direction="down" in={open} mountOnEnter unmountOnExit>
          <Box
            className={styles.modalBox} // Apply CSS Module class
            sx={{
              p: 4,
              position: "relative",
              backgroundColor: "background.paper",
              borderRadius: "10px",
              boxShadow: 24,
              maxWidth: "90%",
              maxHeight: "90%",
              overflow: "auto",
            }}
          >
            <IconButton
              aria-label="close image modal"
              onClick={handleClose}
              sx={{
                position: "absolute",
                top: "10px",
                right: "10px",
                color: "#000000",
              }}
            >
              <CloseIcon />
            </IconButton>
            {modalImage ? (
              <Image
                src={modalImage}
                alt="Enlarged Photo"
                width={850}
                height={510}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  borderRadius: "10px",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/fallback.jpg"; // Ensure this image exists in your public folder
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#e0e0e0",
                  borderRadius: "10px",
                }}
              ></div>
            )}
          </Box>
        </Slide>
      </Modal>
    </div>
  );
};

// Define PropTypes for type checking
Itinerary.propTypes = {
  tour: PropTypes.shape({
    itinerary: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string, // Optional, handled with default value
        description: PropTypes.string,
        photo: PropTypes.string, // Optional
        time: PropTypes.string, // Can be empty string
        distance: PropTypes.string, // Can be empty string
        maxAltitude: PropTypes.string, // Can be empty string
        accommodation: PropTypes.shape({
          label: PropTypes.string,
          images: PropTypes.arrayOf(
            PropTypes.shape({
              storagePath: PropTypes.string,
              url: PropTypes.string,
            })
          ),
        }),
        destination: PropTypes.shape({
          label: PropTypes.string,
          destinationName: PropTypes.string,
          images: PropTypes.arrayOf(
            PropTypes.shape({
              storagePath: PropTypes.string,
              url: PropTypes.string,
            })
          ),
        }),
        meals: PropTypes.arrayOf(
          PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string,
          })
        ),
      })
    ).isRequired,
  }).isRequired,
};

export default Itinerary;
