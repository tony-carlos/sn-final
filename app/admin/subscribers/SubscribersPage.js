// app/admin/subscribers/page.jsx

"use client";

import React, { useState, useMemo } from "react";
import useSubscribers from "@/app/hooks/useSubscribers";
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
import { Delete, Visibility, Search } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";

/**
 * Style for the modal dialog.
 */
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  maxHeight: "80vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

/**
 * SubscribersPage Component
 *
 * Displays a list of subscribers with options to view more details, delete, and send notifications.
 */
const SubscribersPage = () => {
  const { subscribers, loading } = useSubscribers();
  const [open, setOpen] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [notificationContent, setNotificationContent] = useState("");
  const [notificationSubject, setNotificationSubject] = useState("");
  const [sendingNotification, setSendingNotification] = useState(false);

  const router = useRouter();

  // Number of subscribers per page
  const pageSize = 10;

  /**
   * Handle opening the subscriber details modal.
   */
  const handleOpen = (subscriber) => {
    setSelectedSubscriber(subscriber);
    setOpen(true);
  };

  /**
   * Handle closing the subscriber details modal.
   */
  const handleClose = () => {
    setOpen(false);
    setSelectedSubscriber(null);
  };

  /**
   * Handle clicking the delete button, opening confirmation dialog.
   */
  const handleDeleteClick = (subscriber) => {
    setSubscriberToDelete(subscriber);
    setDeleteDialogOpen(true);
  };

  /**
   * Confirm deletion of the subscriber.
   */
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/subscribers/${subscriberToDelete.id}`);
      setSnackbar({
        open: true,
        message: "Subscriber deleted successfully.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete subscriber.",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSubscriberToDelete(null);
    }
  };

  /**
   * Cancel deletion of the subscriber.
   */
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSubscriberToDelete(null);
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
   * Filtered subscribers based on search query.
   * Case-insensitive search on email.
   */
  const filteredSubscribers = useMemo(() => {
    if (!searchQuery) return subscribers;
    const lowerQuery = searchQuery.toLowerCase();
    return subscribers.filter((subscriber) =>
      subscriber.email.toLowerCase().includes(lowerQuery)
    );
  }, [subscribers, searchQuery]);

  /**
   * Paginated subscribers based on current page and pageSize.
   */
  const paginatedSubscribers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredSubscribers.slice(startIndex, endIndex);
  }, [filteredSubscribers, currentPage, pageSize]);

  /**
   * Total number of pages.
   */
  const totalPages = Math.ceil(filteredSubscribers.length / pageSize);

  /**
   * Handle page change in pagination.
   */
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  /**
   * Handle opening the notification modal.
   */
  const handleNotificationOpen = () => {
    setNotificationModalOpen(true);
  };

  /**
   * Handle closing the notification modal.
   */
  const handleNotificationClose = () => {
    setNotificationModalOpen(false);
    setNotificationContent("");
    setNotificationSubject("");
  };

  /**
   * Handle sending notifications to all subscribers.
   */
  const handleSendNotification = async () => {
    if (!notificationContent.trim()) {
      setSnackbar({
        open: true,
        message: "Notification content cannot be empty.",
        severity: "warning",
      });
      return;
    }

    if (!notificationSubject.trim()) {
      setSnackbar({
        open: true,
        message: "Email subject cannot be empty.",
        severity: "warning",
      });
      return;
    }

    setSendingNotification(true);

    try {
      const response = await axios.post("/api/subscribers/send-notification", {
        subject: notificationSubject,
        content: notificationContent,
      });

      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: "Notifications sent successfully.",
          severity: "success",
        });
        handleNotificationClose();
      } else {
        throw new Error("Failed to send notifications.");
      }
    } catch (error) {
      console.error("Error sending notifications:", error);
      setSnackbar({
        open: true,
        message: "Failed to send notifications.",
        severity: "error",
      });
    } finally {
      setSendingNotification(false);
    }
  };

  return (
    <div className="p-6">
      <Typography variant="h4" gutterBottom>
        Subscribers
      </Typography>

      {/* Notification Button */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<SendIcon />}
        onClick={handleNotificationOpen}
        sx={{ mb: 2 }}
      >
        Send Notification
      </Button>

      {/* Search Bar */}
      <TextField
        label="Search by Email"
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
            <Table aria-label="subscribers table">
              <TableHead>
                <TableRow>
                  {/* Number Row Header */}
                  <TableCell align="center" width="5%">
                    No.
                  </TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Subscribed At</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedSubscribers.map((subscriber, index) => (
                  <TableRow key={subscriber.id}>
                    {/* Number Row Cell */}
                    <TableCell align="center">
                      {(currentPage - 1) * pageSize + index + 1}
                    </TableCell>
                    <TableCell>{subscriber.email}</TableCell>
                    <TableCell>
                      {subscriber.createdAt
                        ? new Date(
                            subscriber.createdAt.seconds * 1000
                          ).toLocaleString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {/* Actions: View and Delete */}
                      <IconButton
                        color="primary"
                        onClick={() => handleOpen(subscriber)}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(subscriber)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedSubscribers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No subscribers found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Conditional Pagination Controls */}
          {filteredSubscribers.length > pageSize && (
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

      {/* Modal for Subscriber Details */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="subscriber-details"
      >
        <Box sx={modalStyle}>
          {selectedSubscriber && (
            <>
              <Typography
                id="subscriber-details"
                variant="h6"
                component="h2"
                gutterBottom
              >
                Subscriber Details
              </Typography>
              <Typography>
                <strong>Email:</strong> {selectedSubscriber.email}
              </Typography>
              <Typography>
                <strong>Subscribed At:</strong>{" "}
                {selectedSubscriber.createdAt
                  ? new Date(
                      selectedSubscriber.createdAt.seconds * 1000
                    ).toLocaleString()
                  : "N/A"}
              </Typography>
              <Button
                onClick={handleClose}
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
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
            Are you sure you want to delete the subscriber 
            {subscriberToDelete?.email}?
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

      {/* Notification Modal */}
      <Modal
        open={notificationModalOpen}
        onClose={handleNotificationClose}
        aria-labelledby="send-notification-modal"
      >
        <Box sx={modalStyle}>
          <Typography
            id="send-notification-modal"
            variant="h6"
            component="h2"
            gutterBottom
          >
            Send Notification to All Subscribers
          </Typography>
          <TextField
            label="Email Subject"
            variant="outlined"
            value={notificationSubject}
            onChange={(e) => setNotificationSubject(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Notification Content"
            variant="outlined"
            multiline
            rows={6}
            value={notificationContent}
            onChange={(e) => setNotificationContent(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              onClick={handleNotificationClose}
              color="secondary"
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendNotification}
              variant="contained"
              color="primary"
              disabled={sendingNotification}
            >
              {sendingNotification ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Send"
              )}
            </Button>
          </Box>
        </Box>
      </Modal>

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

export default SubscribersPage;
