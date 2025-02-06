// components/tours/PriceDisplay.jsx

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";

// Styled component for the container with responsive padding and border
const StyledBox = styled(Box)(({ theme }) => ({
  position: "relative",
  /* backgroundImage: `url(${templatePattern.src})`, // Removed background image */
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  color: "#000",
  border: "1px solid #ccc", // Added border
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2.5), // Equivalent to py-15 (15px) and px-20 (20px)
    border: "1px solid #ccc", // Ensure border is present on small devices
  },
}));

// Overlay removed as background image is removed
/* const Overlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent overlay
  borderRadius: theme.spacing(2),
})); */

// Content container to ensure content is above any overlay (if present)
const ContentBox = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 1, // Ensures content is above any overlay
}));

const PriceDisplay = ({ pricing }) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    const handleResize = () => {
      // You can handle any dynamic adjustments here if needed
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [theme.breakpoints.values.md]);

  // Debug: Check if pricing prop is received

  if (!pricing) {
    return (
      <Typography variant="h6" color="error">
        No pricing information available.
      </Typography>
    );
  }

  // Define seasons and their labels
  const seasons = [
    { key: "lowSeason", label: "Low Season " },
    { key: "midSeason", label: "Mid Season " },
    { key: "highSeason", label: "High Season " },
  ];

  return (
    <StyledBox>
      {/* Removed Overlay as background image is removed */}
      {/* <Overlay /> */}
      <ContentBox>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontStyle: "normal", color: isLargeScreen ? "#000" : "#000" }}
        ></Typography>

        {seasons.map((season) => {
          const seasonData = pricing[season.key];
          // Debug: Check if seasonData is present

          if (
            !seasonData ||
            !seasonData.costs ||
            seasonData.costs.length === 0
          ) {
            return (
              <Box key={season.key} sx={{ mb: 4 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontStyle: "normal",
                    color: isLargeScreen ? "#000" : "#000",
                  }}
                >
                  {season.label}
                </Typography>
                <Typography variant="body1" color="error">
                  No pricing available for this season.
                </Typography>
              </Box>
            );
          }

          // Find '2 Persons' cost
          let twoPersonsCostObj = seasonData.costs.find(
            (c) => c.category === "2 Persons"
          );
          let twoPersonsCost = 0;

          if (twoPersonsCostObj) {
            twoPersonsCost = twoPersonsCostObj.cost;
          } else {
            // Assume first entry is '2 Persons' if '2 Persons' category is not found
            twoPersonsCostObj = seasonData.costs[0];
            twoPersonsCost = twoPersonsCostObj.cost;
            console.warn(
              `2 Persons cost not found for ${season.key}, using first entry.`
            );
          }

          // Calculate discounted prices
          const fourPersonsCost = (twoPersonsCost * 0.92).toFixed(2); // 8% discount
          const sixPlusPersonsCost = (twoPersonsCost * 0.9).toFixed(2); // 10% discount

          // Debug: Check calculated prices
       

          return (
            <Box key={season.key} sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontStyle: "normal",
                  color: isLargeScreen ? "#000" : "#000",
                }}
              >
                {season.label}
              </Typography>
              <TableContainer
                component={Paper}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  overflowX: "auto",
                }}
              >
                <Table
                  aria-label={`${season.key} pricing table`}
                  sx={{ minWidth: 300 }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          color: isLargeScreen ? "#000" : "#000",
                        }}
                      >
                        2 Persons
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          color: isLargeScreen ? "#000" : "#000",
                        }}
                      >
                        4 Persons
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          color: isLargeScreen ? "#000" : "#000",
                        }}
                      >
                        6+ Persons
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        align="center"
                        sx={{ fontStyle: "normal", color: "#000" }}
                      >
                        ${twoPersonsCost.toFixed(2)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontStyle: "normal", color: "#000" }}
                      >
                        ${fourPersonsCost}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontStyle: "normal", color: "#000" }}
                      >
                        ${sixPlusPersonsCost}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          );
        })}
      </ContentBox>
    </StyledBox>
  );
};

export default PriceDisplay;
