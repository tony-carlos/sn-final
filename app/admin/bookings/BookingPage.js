// /app/admin/bookings/page.jsx

"use client";

import React, { useState, useMemo } from "react";
import useBookings from "@/app/hooks/useBookings";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Modal,
  Box,
  Typography,
  Button,
  Pagination,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Delete, Edit, Visibility, Search } from "@mui/icons-material";
import { useRouter } from "next/navigation";

/**
 * Style for the modal dialog.
 */
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  maxHeight: "80vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

/**
 * BookingPage Component
 *
 * Displays a list of bookings with options to view more details, edit, or delete.
 * Includes search functionality, pagination, and toast notifications.
 * Also includes a Number Row for easy reference.
 */
const BookingPage = () => {
  const { bookings, loading, deleteBooking } = useBookings();
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();

  // Number of bookings per page
  const pageSize = 10;

  /**
   * Handle opening the booking details modal.
   */
  const handleOpen = (booking) => {
    setSelectedBooking(booking);
    setOpen(true);
  };

  /**
   * Handle closing the booking details modal.
   */
  const handleClose = () => {
    setOpen(false);
    setSelectedBooking(null);
  };

  /**
   * Handle navigation to the edit booking page.
   */
  const handleEdit = (id) => {
    router.push(`/admin/bookings/edit/${id}`);
  };

  /**
   * Handle clicking the delete button, opening confirmation dialog.
   */
  const handleDeleteClick = (booking) => {
    setBookingToDelete(booking);
    setDeleteDialogOpen(true);
  };

  /**
   * Confirm deletion of the booking.
   */
  const handleDeleteConfirm = async () => {
    try {
      await deleteBooking(bookingToDelete.id);
      setSnackbar({
        open: true,
        message: "Booking deleted successfully.",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete booking.",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setBookingToDelete(null);
    }
  };

  /**
   * Cancel deletion of the booking.
   */
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setBookingToDelete(null);
  };

  /**
   * Handle closing the snackbar.
   */
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  /**
   * Handle search input change.
   */
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  /**
   * Filtered bookings based on search query.
   * Case-insensitive search on fullName, email, and tourTitle.
   */
  const filteredBookings = useMemo(() => {
    if (!searchQuery) return bookings;
    const lowerQuery = searchQuery.toLowerCase();
    return bookings.filter(
      (booking) =>
        booking.fullName.toLowerCase().includes(lowerQuery) ||
        booking.email.toLowerCase().includes(lowerQuery) ||
        booking.tourTitle.toLowerCase().includes(lowerQuery)
    );
  }, [bookings, searchQuery]);

  /**
   * Paginated bookings based on current page and pageSize.
   */
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredBookings.slice(startIndex, endIndex);
  }, [filteredBookings, currentPage, pageSize]);

  /**
   * Total number of pages.
   */
  const totalPages = Math.ceil(filteredBookings.length / pageSize);

  /**
   * Handle page change in pagination.
   */
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
      <div className="p-6">
        <Typography variant="h4" gutterBottom>
          Bookings
        </Typography>

        {/* Search Bar */}
        <TextField
          label="Search by Name, Email, or Tour Title"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          fullWidth
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table aria-label="bookings table">
                <TableHead>
                  <TableRow>
                    {/* Number Row Header */}
                    <TableCell align="center" width="5%">
                      NO#
                    </TableCell>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell>Tour Title</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedBookings.map((booking, index) => (
                    <TableRow key={booking.id}>
                      {/* Number Row Cell */}
                      <TableCell align="center">
                        {(currentPage - 1) * pageSize + index + 1}
                      </TableCell>
                      <TableCell>{booking.fullName}</TableCell>
                      <TableCell>{booking.email}</TableCell>
                      <TableCell>{booking.phoneNumber}</TableCell>
                      <TableCell>{booking.tourTitle}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleOpen(booking)}
                        >
                          <Visibility />
                        </IconButton>
                        
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(booking)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedBookings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No bookings found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Conditional Pagination Controls */}
            {filteredBookings.length > pageSize && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mt={2}
              >
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  siblingCount={1}
                  boundaryCount={1}
                />
              </Box>
            )}
          </>
        )}

        {/* Modal for More Details */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="booking-details"
        >
          <Box sx={modalStyle}>
            {selectedBooking && (
              <>
                <Typography
                  id="booking-details"
                  variant="h6"
                  component="h2"
                  gutterBottom
                >
                  Booking Details
                </Typography>
                <Typography>
                  <strong>Full Name:</strong> {selectedBooking.fullName}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {selectedBooking.email}
                </Typography>
                <Typography>
                  <strong>Phone Number:</strong> {selectedBooking.phoneNumber}
                </Typography>
                <Typography>
                  <strong>Tour Title:</strong> {selectedBooking.tourTitle}
                </Typography>
                <Typography>
                  <strong>Adults:</strong> {selectedBooking.adults}
                </Typography>
                <Typography>
                  <strong>Youths:</strong> {selectedBooking.youths}
                </Typography>
                <Typography>
                  <strong>Message:</strong> {selectedBooking.message}
                </Typography>
                <Typography>
                  <strong>Start Date:</strong>{" "}
                  {selectedBooking.startDate
                    ? new Date(
                        selectedBooking.startDate.seconds * 1000
                      ).toLocaleDateString()
                    : "N/A"}
                </Typography>
                <Button
                  onClick={handleClose}
                  variant="contained"
                  color="primary"
                  className="mt-4"
                >
                  Close
                </Button>
              </>
            )}
          </Box>
        </Modal>

        {/* Confirmation Dialog for Deletion */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="delete-confirmation-dialog"
        >
          <DialogTitle id="delete-confirmation-dialog">
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the booking for "
              {bookingToDelete?.fullName}"?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for Notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
  );
};

export default BookingPage;
