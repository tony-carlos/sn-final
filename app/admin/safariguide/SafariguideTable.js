// /app/admin/safariguide/SafariguideTable.js

"use client";

import React, { useEffect, useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  InputLabel,
  FormControl,
  IconButton,
  Button,
} from "@mui/material";
import { db, storage } from "@/app/lib/firebase"; // Adjust the import path if necessary
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useForm, Controller } from "react-hook-form";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { toast, Slide } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import GetAppIcon from "@mui/icons-material/GetApp"; // Import GetAppIcon
import Image from "next/image"; // Import Image from next/image
import SafariguideForm from "./SafariguideForm"; // Import the form component
import ImageCropper from "./ImageCropper"; // Ensure this path is correct

const predefinedKeywords = [
  "Tanzania Safari",
  "Mountain Safari",
  "Zanzibar",
  "Lake Victoria",
  "Serengeti",
  "Ngorongoro",
  "Tarangire",
  "Ruaha",
  "Selous",
  "Mount Kilimanjaro",
  // Add more predefined keywords as needed
];

const SafariguideTable = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentGuide, setCurrentGuide] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false); // State for Add Dialog

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "safariguide"));
      const guidesData = [];
      querySnapshot.forEach((doc) => {
        guidesData.push({ id: doc.id, ...doc.data() });
      });
      setGuides(guidesData);
    } catch (error) {
      console.error("Error fetching guides: ", error);
      toast.error("Failed to fetch Safari Guides.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    // Show custom confirmation toast
    toast.info(
      <div>
        <Typography variant="body1">Are you sure you want to delete this Safari Guide?</Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            onClick={() => confirmDelete(id)}
            color="error"
            variant="contained"
            size="small"
            sx={{ mr: 1 }}
          >
            Yes
          </Button>
          <Button onClick={() => toast.dismiss()} color="primary" variant="outlined" size="small">
            No
          </Button>
        </Box>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        transition: Slide,
        toastId: "delete-confirmation", // Assign a unique toastId
      }
    );
  };

  const confirmDelete = async (id) => {
    try {
      // Dismiss the confirmation toast
      toast.dismiss("delete-confirmation");

      const guide = guides.find((g) => g.id === id);
      if (guide.images && guide.images.length > 0) {
        // Delete images from Storage
        await Promise.all(
          guide.images.map(async (imgUrl) => {
            const imgPath = imgUrl.split("/o/")[1].split("?")[0];
            const imgRef = ref(storage, decodeURIComponent(imgPath));
            await deleteObject(imgRef).catch((err) => console.error("Error deleting image:", err));
          })
        );
      }
      if (guide.seo && guide.seo.image) {
        // Delete SEO image
        const seoImgPath = guide.seo.image.split("/o/")[1].split("?")[0];
        const seoImgRef = ref(storage, decodeURIComponent(seoImgPath));
        await deleteObject(seoImgRef).catch((err) => console.error("Error deleting SEO image:", err));
      }

      await deleteDoc(doc(db, "safariguide", id));
      setGuides(guides.filter((guide) => guide.id !== id));
      toast.success("Safari Guide deleted successfully.");
    } catch (error) {
      console.error("Error deleting guide: ", error);
      toast.error("Failed to delete Safari Guide.");
    }
  };

  const openEditDialog = (guide) => {
    setCurrentGuide(guide);
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setCurrentGuide(null);
  };

  const openAddDialog = () => {
    setAddDialogOpen(true);
  };

  const closeAddDialog = () => {
    setAddDialogOpen(false);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4">Safari Guides</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={openAddDialog}
        >
          Add New Safari Guide
        </Button>
      </Box>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="Safari Guides Table">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Images</TableCell>
               
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {guides.map((guide) => (
                <TableRow key={guide.id}>
                  <TableCell>{guide.title}</TableCell>
            
                  <TableCell>
                    {guide.images && guide.images.length > 0 ? (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {guide.images.slice(0, 2).map((img) => (
                          <Box key={img} sx={{ width: 100, height: 80, position: "relative", borderRadius: 1, overflow: "hidden", boxShadow: 1 }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img}
                              alt={`Guide ${guide.title} Image`}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      "No Images"
                    )}
                  </TableCell>
                
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => openEditDialog(guide)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(guide.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {guides.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No Safari Guides found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={closeEditDialog} maxWidth="md" fullWidth>
        <DialogTitle>Edit Safari Guide</DialogTitle>
        <DialogContent>
          {currentGuide && (
            <SafariguideForm
              closeDialog={closeEditDialog}
              guideToEdit={currentGuide}
              refreshGuides={fetchGuides}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add New Safari Guide Dialog */}
      <Dialog open={addDialogOpen} onClose={closeAddDialog} maxWidth="md" fullWidth>
        <DialogTitle>Add New Safari Guide</DialogTitle>
        <DialogContent>
          <SafariguideForm closeDialog={closeAddDialog} refreshGuides={fetchGuides} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SafariguideTable;
