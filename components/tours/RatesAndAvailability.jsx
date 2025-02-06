"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  IconButton,
  Pagination,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useMediaQuery,
  useTheme,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import axios from "axios";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RatesAndAvailability = ({ tour }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentRate, setCurrentRate] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [page, setPage] = useState(1);

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  // Define rates per page based on screen size
  const ratesPerPage = isLargeScreen ? 5 : 1;

  // Generate rates based on pricing and duration
  const rates = generateRates(tour.pricing, tour.basicInfo.durationValue);

  const totalPages = Math.ceil(rates.length / ratesPerPage);

  // Slice rates for current page
  const paginatedRates = rates.slice(
    (page - 1) * ratesPerPage,
    page * ratesPerPage
  );

  // Handle input changes in the booking form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Handle email submission
  const handleEmailSubmit = async () => {
    // Basic form validation
    if (!formValues.name) {
      toast.error("Please enter your name.");
      return;
    }
    if (!formValues.email) {
      toast.error("Please enter your email address.");
      return;
    }
    if (!formValues.phone) {
      toast.error("Please enter your phone number.");
      return;
    }
    if (!formValues.message) {
      toast.error("Please enter a message.");
      return;
    }

    try {
      console.log("Submitting booking inquiry...", {
        ...formValues,
        tourTitle: tour.basicInfo.tourTitle,
        from: currentRate.from,
        to: currentRate.to,
      });

      const response = await axios.post("/api/send-email", {
        ...formValues,
        tourTitle: tour.basicInfo.tourTitle,
        from: currentRate.from,
        to: currentRate.to,
      });

      console.log("Server response:", response.data);

      if (response.data.message === "Emails sent successfully") {
        toast.success(
          "Booking inquiry sent successfully! Please check your email for confirmation."
        );
        setModalOpen(false);
        setFormValues({ name: "", email: "", phone: "", message: "" });
      }
    } catch (error) {
      console.error("Error details:", error.response?.data || error);
      toast.error(
        "Unable to send booking inquiry. Please contact us directly at info@serengetinexu.com or +255 759 964 985"
      );
    }
  };

  // Redirect to WhatsApp with the booking details
  const handleWhatsAppRedirect = () => {
    const message = `Dear Serengeti Nexus,

Greetings!

I hope this message finds you well. I am reaching out to express my interest in booking one of your exceptional tours. Please find the details of my inquiry below:

Tour Title: ${tour.basicInfo.tourTitle}
From: ${currentRate.from}
To: ${currentRate.to}
Price: ${currentRate.price}

I would appreciate it if you could confirm the availability of this tour and provide any additional details required to finalize the booking.

Looking forward to your prompt response.

Best regards,
${formValues.name}
`;

    window.open(
      `https://wa.me/255759964985?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <Box sx={{ mt: 4, fontFamily: "Roboto, sans-serif" }}>
      <Typography variant="h5" gutterBottom sx={{ fontStyle: "normal" }}>
        Rates and Availability
      </Typography>

      {/* Large Screens: Display rates in a table */}
      {isLargeScreen && (
        <Paper sx={{ overflowX: "auto", mt: 2 }}>
          <Table aria-label="rates table">
            <TableHead>
              <TableRow>
                <TableCell align="center">From</TableCell>
                <TableCell align="center">To</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Book</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRates.map((rate, index) => (
                <TableRow key={index}>
                  <TableCell align="center" sx={{ fontStyle: "normal" }}>
                    {rate.from}
                  </TableCell>
                  <TableCell align="center" sx={{ fontStyle: "normal" }}>
                    {rate.to}
                  </TableCell>
                  <TableCell align="center" sx={{ fontStyle: "normal" }}>
                    ${rate.price}
                  </TableCell>
                  <TableCell align="center" sx={{ fontStyle: "normal" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setCurrentRate(rate);
                        setModalOpen(true);
                      }}
                      sx={{ backgroundColor: "#947a57", color: "#fff" }}
                    >
                      Book Now
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Small Screens: Display one rate box at a time */}
      {!isLargeScreen && (
        <Box sx={{ mt: 2 }}>
          {paginatedRates.map((rate, index) => (
            <Box
              key={index}
              sx={{
                border: "1px solid #947a57",
                borderRadius: "8px",
                p: 2,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  From:
                </Typography>
                <Typography variant="body1" sx={{ textAlign: "right" }}>
                  {rate.from}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  To:
                </Typography>
                <Typography variant="body1" sx={{ textAlign: "right" }}>
                  {rate.to}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Price:
                </Typography>
                <Typography variant="body1" sx={{ textAlign: "right" }}>
                  ${rate.price}
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => {
                  setCurrentRate(rate);
                  setModalOpen(true);
                }}
                sx={{ backgroundColor: "#947a57", color: "#fff" }}
              >
                Book Now
              </Button>
            </Box>
          ))}
        </Box>
      )}

      {/* Pagination Controls */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
          sx={{
            "& .MuiPaginationItem-root": {
              fontFamily: "Roboto, sans-serif",
              fontStyle: "normal",
            },
          }}
        />
      </Box>

      {/* Booking Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="booking-modal-title"
        aria-describedby="booking-modal-description"
        centered
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={() => setModalOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            id="booking-modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontStyle: "normal" }}
          >
            Book Now
          </Typography>
          <TextField
            label="Name"
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2, fontStyle: "normal" }}
          />
          <TextField
            label="Email"
            name="email"
            value={formValues.email}
            onChange={handleInputChange}
            type="email"
            fullWidth
            required
            sx={{ mb: 2, fontStyle: "normal" }}
          />
          <TextField
            label="Phone"
            name="phone"
            value={formValues.phone}
            onChange={handleInputChange}
            type="tel"
            fullWidth
            required
            sx={{ mb: 2, fontStyle: "normal" }}
          />
          <TextField
            label="Message"
            name="message"
            value={formValues.message}
            onChange={handleInputChange}
            multiline
            rows={4}
            fullWidth
            required
            sx={{ mb: 2, fontStyle: "normal" }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleEmailSubmit}
            sx={{
              backgroundColor: "#947a57",
              color: "#fff",
              mb: 1,
              fontStyle: "normal",
            }}
          >
            Send via Email
          </Button>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleWhatsAppRedirect}
            sx={{
              backgroundColor: "#25D366",
              color: "#fff",
              fontStyle: "normal",
            }}
          >
            Send via WhatsApp <WhatsAppIcon sx={{ ml: 1 }} />
          </Button>
        </Box>
      </Modal>

      {/* ToastContainer for Toast Notifications */}
      <ToastContainer
        position="top-right" // Changed position to top-right
        autoClose={6000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Box>
  );
};

// Helper function to generate rates based on pricing and duration
const generateRates = (pricing, durationValue) => {
  const today = dayjs();
  const nextYear = today.add(1, "year");
  const rates = [];
  let currentDate = today;

  while (currentDate.isBefore(nextYear)) {
    const from = currentDate.format("YYYY-MM-DD");
    const to = currentDate.add(durationValue, "day").format("YYYY-MM-DD");
    const month = currentDate.month(); // 0-based (0=January)

    let season;
    if (month >= 3 && month <= 4) {
      // April and May
      season = "lowSeason";
    } else if (month === 6 || month === 7) {
      // July and August
      season = "highSeason";
    } else {
      season = "midSeason";
    }

    // Ensure pricing.manual[season] exists
    if (pricing?.manual?.[season]?.costs) {
      pricing.manual[season].costs.forEach((cost) => {
        rates.push({
          from,
          to,
          price: cost.cost,
        });
      });
    }

    currentDate = currentDate.add(durationValue + 1, "day");
  }

  return rates;
};

export default RatesAndAvailability;
