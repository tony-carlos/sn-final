// /app/admin/customizedrequest/page.jsx

"use client";

import React, { useState, useMemo } from "react";
import useCustomizedRequests from "@/app/hooks/useCustomizedRequests";
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
  width: 500,
  maxHeight: "80vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

/**
 * CustomizedRequestPage Component
 *
 * Displays a list of customized requests with options to view more details, edit, or delete.
 * Includes search functionality, conditional pagination, toast notifications, and a Number Row.
 */
const CustomizedRequestPage = () => {
  const { requests, loading, deleteRequest } = useCustomizedRequests();
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();

  // Number of requests per page
  const pageSize = 10;

  /**
   * Handle opening the request details modal.
   */
  const handleOpen = (request) => {
    setSelectedRequest(request);
    setOpen(true);
  };

  /**
   * Handle closing the request details modal.
   */
  const handleClose = () => {
    setOpen(false);
    setSelectedRequest(null);
  };

  /**
   * Handle navigation to the edit request page.
   */
  const handleEdit = (id) => {
    router.push(`/admin/customizedrequest/edit/${id}`);
  };

  /**
   * Handle clicking the delete button, opening confirmation dialog.
   */
  const handleDeleteClick = (request) => {
    setRequestToDelete(request);
    setDeleteDialogOpen(true);
  };

  /**
   * Confirm deletion of the request.
   */
  const handleDeleteConfirm = async () => {
    try {
      await deleteRequest(requestToDelete.id);
      setSnackbar({
        open: true,
        message: "Customized request deleted successfully.",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete customized request.",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setRequestToDelete(null);
    }
  };

  /**
   * Cancel deletion of the request.
   */
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setRequestToDelete(null);
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
   * Filtered requests based on search query.
   * Case-insensitive search on fullName, email, and tripType.
   */
  const filteredRequests = useMemo(() => {
    if (!searchQuery) return requests;
    const lowerQuery = searchQuery.toLowerCase();
    return requests.filter(
      (request) =>
        request.fullName.toLowerCase().includes(lowerQuery) ||
        request.email.toLowerCase().includes(lowerQuery) ||
        request.tripType.toLowerCase().includes(lowerQuery)
    );
  }, [requests, searchQuery]);

  /**
   * Paginated requests based on current page and pageSize.
   */
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredRequests.slice(startIndex, endIndex);
  }, [filteredRequests, currentPage, pageSize]);

  /**
   * Total number of pages.
   */
  const totalPages = Math.ceil(filteredRequests.length / pageSize);

  /**
   * Handle page change in pagination.
   */
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="p-6">
      <Typography variant="h4" gutterBottom>
        Customized Requests
      </Typography>

      {/* Search Bar */}
      <TextField
        label="Search by Name, Email, or Trip Type"
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
            <Table aria-label="customized requests table">
              <TableHead>
                <TableRow>
                  {/* Number Row Header */}
                  <TableCell align="center" width="5%">
                    No.
                  </TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Trip Type</TableCell>
                  <TableCell>Adults</TableCell>
                  <TableCell>Budget</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRequests.map((request, index) => (
                  <TableRow key={request.id}>
                    {/* Number Row Cell */}
                    <TableCell align="center">
                      {(currentPage - 1) * pageSize + index + 1}
                    </TableCell>
                    <TableCell>{request.fullName}</TableCell>
                    <TableCell>{request.phone}</TableCell>
                    <TableCell>{request.tripType}</TableCell>
                    <TableCell>{request.adult}</TableCell>
                    <TableCell>{request.budget}</TableCell>
                    <TableCell>{request.email}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpen(request)}
                      >
                        <Visibility />
                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(request)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedRequests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No customized requests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Conditional Pagination Controls */}
          {filteredRequests.length > pageSize && (
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
        aria-labelledby="request-details"
      >
        <Box sx={modalStyle}>
          {selectedRequest && (
            <>
              <Typography
                id="request-details"
                variant="h6"
                component="h2"
                gutterBottom
              >
                Customized Request Details
              </Typography>
              <Typography>
                <strong>Full Name:</strong> {selectedRequest.fullName}
              </Typography>
              <Typography>
                <strong>Phone:</strong> {selectedRequest.phone}
              </Typography>
              <Typography>
                <strong>Trip Type:</strong> {selectedRequest.tripType}
              </Typography>
              <Typography>
                <strong>Adults:</strong> {selectedRequest.adult}
              </Typography>
              <Typography>
                <strong>Budget:</strong> {selectedRequest.budget}
              </Typography>
              <Typography>
                <strong>Email:</strong> {selectedRequest.email}
              </Typography>
              {/* Model Details */}
              <Box mt={2}>
                <Typography variant="subtitle1" gutterBottom>
                  Additional Information
                </Typography>
                <Typography>
                  <strong>Date:</strong>{" "}
                  {selectedRequest.dateVal
                    ? new Date(selectedRequest.dateVal).toLocaleDateString()
                    : "N/A"}
                </Typography>
                <Typography>
                  <strong>Children:</strong> {selectedRequest.child}
                </Typography>
                <Typography>
                  <strong>Country:</strong> {selectedRequest.country}
                </Typography>
                <Typography>
                  <strong>Duration:</strong> {selectedRequest.duration}
                </Typography>
                <Typography>
                  <strong>Additional Info:</strong>{" "}
                  {selectedRequest.additionalInfo}
                </Typography>
              </Box>
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
            Are you sure you want to delete the customized request for
            {requestToDelete?.fullName}?
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

export default CustomizedRequestPage;
