// app/admin/blogs/page.jsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  where,
  updateDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/app/lib/firebase";
import CropDialog from "./CropDialog";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  IconButton,
  Grid,
} from "@mui/material";
import Image from "next/image";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import generateSlug from "@/app/utils/generateSlug";

const AdminBlogs = () => {
  // ========== State for blog listing ==========
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  // ========== States for "Create/Edit Blog" dialog ==========
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditingBlogId, setCurrentEditingBlogId] = useState(null);
  const [originalTitle, setOriginalTitle] = useState("");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  // ========== States for existing images (during edit) ==========
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  // ========== States for new image handling ==========
  const [selectedFiles, setSelectedFiles] = useState([]); // Array of original files
  const [croppedBlobs, setCroppedBlobs] = useState([]);   // Array of cropped blobs
  const [openCropDialog, setOpenCropDialog] = useState(false);
  const [currentCropIndex, setCurrentCropIndex] = useState(0); // Index of the file being cropped

  // ========== Reference to store object URLs for cleanup ==========
  const objectUrlsRef = useRef([]);

  // ========== Reference to store original title (for edit) ==========
  // Not necessary here since using originalTitle state

  // ========== For demonstration, static category list ==========
  const categoriesList = [
    "Adventure",
    "Tips",
    "Safari",
    "Wildlife",
    "Cultural",
    "Beaches",
    "Luxury",
    "Budget",
  ];

  // ========== Fetch blogs on mount ==========
  useEffect(() => {
    fetchBlogs();

    // Cleanup object URLs on unmount
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const fetchBlogs = async () => {
    setLoadingBlogs(true);
    try {
      const blogsRef = collection(db, "blogs");
      const q = query(blogsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const blogsData = [];
      snapshot.forEach((doc) => blogsData.push({ id: doc.id, ...doc.data() }));
      setBlogs(blogsData);
      setLoadingBlogs(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to fetch blogs.");
      setLoadingBlogs(false);
    }
  };

  // ========== Handlers for Create/Edit Dialog ==========
  const handleOpenCreate = () => {
    // Reset form
    setIsEditing(false);
    setCurrentEditingBlogId(null);
    setOriginalTitle("");
    setTitle("");
    setCategory("");
    setDescription("");
    setExistingImages([]);
    setImagesToDelete([]);
    setSelectedFiles([]);
    setCroppedBlobs([]);
    setOpenFormDialog(true);
  };

  const handleCloseForm = () => {
    setOpenFormDialog(false);
  };

  // When user picks files in the "Create/Edit Blog" dialog
  const handleSelectFiles = (e) => {
    const files = e.target.files;
    if (!files) return;
    const filesArray = Array.from(files);
    // Optionally, validate file types here
    setSelectedFiles((prev) => [...prev, ...filesArray]);
    setOpenCropDialog(true);
  };

  // ========== Creating or Updating a blog in Firestore ==========
  const handleCreateOrUpdateBlog = async () => {
    if (!title || !category || !description) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!isEditing && croppedBlobs.length === 0) {
      toast.error("Please select and crop at least one image.");
      return;
    }

    try {
      // Generate slug
      let slug = generateSlug(title);

      // Check for slug uniqueness
      const slugQuery = query(collection(db, "blogs"), where("slug", "==", slug));
      const slugSnapshot = await getDocs(slugQuery);
      let uniqueSlug = slug;
      let counter = 1;
      while (!slugSnapshot.empty) {
        uniqueSlug = `${slug}-${counter}`;
        const newSlugSnapshot = await getDocs(
          query(collection(db, "blogs"), where("slug", "==", uniqueSlug))
        );
        if (newSlugSnapshot.empty) break;
        counter++;
      }

      // Handle images
      let imageUrls = [...existingImages]; // Start with existing images

      // Handle images to delete (if editing)
      if (isEditing && imagesToDelete.length > 0) {
        for (const url of imagesToDelete) {
          const fileRef = ref(storage, url);
          await deleteObject(fileRef);
          imageUrls = imageUrls.filter((imageUrl) => imageUrl !== url);
        }
      }

      // Upload all croppedBlobs to Firebase Storage
      for (const blob of croppedBlobs) {
        const filename = `${Date.now()}_${blob.name || "cropped.jpg"}`;
        const storageRefInstance = ref(storage, `blogs/${filename}`);
        await uploadBytes(storageRefInstance, blob);
        const imageUrl = await getDownloadURL(storageRefInstance);
        imageUrls.push(imageUrl);
      }

      if (isEditing) {
        // Update existing blog
        const blogRef = doc(db, "blogs", currentEditingBlogId);
        await updateDoc(blogRef, {
          title,
          slug: uniqueSlug,
          category,
          description,
          images: imageUrls,
          // Optionally, update other fields
        });

        toast.success("Blog post updated successfully!");
      } else {
        // Create new blog
        await addDoc(collection(db, "blogs"), {
          title,
          slug: uniqueSlug,
          category,
          description,
          images: imageUrls,
          createdAt: serverTimestamp(),
        });

        toast.success("Blog post created successfully!");
      }

      handleCloseForm();
      fetchBlogs();
    } catch (error) {
      console.error("Error creating/updating blog post:", error);
      toast.error("Failed to create/update blog post.");
    }
  };

  // ========== Deleting a blog post ==========
  const handleDelete = async (blogId, images = []) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      // Delete images from storage
      for (const url of images) {
        const fileRef = ref(storage, url);
        await deleteObject(fileRef);
      }
      // Delete doc
      await deleteDoc(doc(db, "blogs", blogId));
      toast.success("Blog deleted successfully.");
      fetchBlogs();
    } catch (err) {
      console.error("Error deleting blog:", err);
      toast.error("Failed to delete blog.");
    }
  };

  // ========== Edit blog functionality ==========
  const handleEdit = (blog) => {
    setIsEditing(true);
    setCurrentEditingBlogId(blog.id);
    setOriginalTitle(blog.title);
    setTitle(blog.title);
    setCategory(blog.category);
    setDescription(blog.description);
    setExistingImages(blog.images || []);
    setImagesToDelete([]);
    setSelectedFiles([]);
    setCroppedBlobs([]);
    setOpenFormDialog(true);
    toast.info("Edit blog: modify title, category, description, and add new images as needed.");
  };

  // ========== Callback when cropping is successful ==========
  const handleCropComplete = (blob) => {
    // Store object URL for cleanup
    const objectUrl = URL.createObjectURL(blob);
    objectUrlsRef.current.push(objectUrl);

    setCroppedBlobs((prev) => [...prev, blob]);
    setOpenCropDialog(false);
    setCurrentCropIndex((prev) => prev + 1);
    toast.success("Image cropped successfully!");
  };

  // ========== Delete a cropped image before submission ==========
  const handleDeleteCroppedBlob = (index) => {
    // Revoke the object URL to free memory
    URL.revokeObjectURL(objectUrlsRef.current[index]);
    objectUrlsRef.current.splice(index, 1);

    setCroppedBlobs((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    toast.info("Cropped image removed.");
  };

  // ========== Delete an existing image during edit ==========
  const handleDeleteExistingImage = (url) => {
    setImagesToDelete((prev) => [...prev, url]);
    setExistingImages((prev) => prev.filter((imageUrl) => imageUrl !== url));
    toast.info("Existing image marked for deletion.");
  };

  // ========== Handle multiple cropping ==========
  useEffect(() => {
    if (openCropDialog && currentCropIndex < selectedFiles.length) {
      // Open CropDialog for the next image
      setOpenCropDialog(true);
    } else if (openCropDialog && currentCropIndex >= selectedFiles.length) {
      setOpenCropDialog(false);
      setCurrentCropIndex(0);
    }
  }, [croppedBlobs, openCropDialog, currentCropIndex, selectedFiles.length]);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f3f3f3", p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Blogs
      </Typography>

      {/* Add New Blog Button aligned to the right */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Button
          variant="contained"
          color="success"
          onClick={handleOpenCreate}
        >
          Add New Blog
        </Button>
      </Box>

      {/* Blog Listing */}
      <Box sx={{ backgroundColor: "#fff", p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
          All Blogs
        </Typography>
        {loadingBlogs ? (
          <Typography>Loading blogs...</Typography>
        ) : blogs.length === 0 ? (
          <Typography>No blogs available.</Typography>
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ padding: "8px", border: "1px solid #ddd" }}>Title</th>
                  <th style={{ padding: "8px", border: "1px solid #ddd" }}>Category</th>
                  <th style={{ padding: "8px", border: "1px solid #ddd" }}>Description</th>
                  <th style={{ padding: "8px", border: "1px solid #ddd" }}>Images</th>
                  <th style={{ padding: "8px", border: "1px solid #ddd" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.id}>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{blog.title}</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{blog.category}</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: blog.description.length > 100
                            ? `${blog.description.substring(0, 100)}...`
                            : blog.description,
                        }}
                      />
                    </td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                      <Grid container spacing={1}>
                        {blog.images &&
                          blog.images.slice(0, 3).map((url, idx) => (
                            <Grid item key={idx}>
                              <Box
                                sx={{
                                  position: "relative",
                                  width: 100,
                                  height: 80,
                                  borderRadius: 1,
                                  overflow: "hidden",
                                  border: "1px solid #ccc",
                                }}
                              >
                                <Image
                                  src={url}
                                  alt={`Blog Image ${idx + 1}`}
                                  fill
                                  style={{ objectFit: "cover" }}
                                />
                              </Box>
                            </Grid>
                          ))}
                        {blog.images && blog.images.length > 3 && (
                          <Grid item>
                            <Box
                              sx={{
                                position: "relative",
                                width: 100,
                                height: 80,
                                borderRadius: 1,
                                overflow: "hidden",
                                border: "1px solid #ccc",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#f0f0f0",
                              }}
                            >
                              <Typography>+{blog.images.length - 3}</Typography>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                      <Button
                        variant="outlined"
                        color="info"
                        size="small"
                        onClick={() => handleEdit(blog)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(blog.id, blog.images)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        )}
      </Box>

      {/* Create/Edit Blog Dialog */}
      <Dialog
        open={openFormDialog}
        onClose={handleCloseForm}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{isEditing ? "Edit Blog" : "Create New Blog"}</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              mt: 1,
            }}
            noValidate
            autoComplete="off"
          >
            {/* Title */}
            <TextField
              label="Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            {/* Category */}
            <FormControl variant="outlined" required>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
              >
                {categoriesList.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Description using CKEditor */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Description
              </Typography>
              <CKEditor
                editor={ClassicEditor}
                data={description}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setDescription(data);
                }}
              />
            </Box>

            {/* Image Upload */}
            <Button variant="outlined" component="label">
              {isEditing ? "Add More Images" : "Upload Images"}
              <input type="file" accept="image/*" multiple hidden onChange={handleSelectFiles} />
            </Button>
            <Typography variant="caption" color="textSecondary">
              Please select images to crop (1200x900 recommended).
            </Typography>

            {/* Existing Images Preview with Delete Icon (only in edit mode) */}
            {isEditing && existingImages.length > 0 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Existing Images:
                </Typography>
                <Grid container spacing={2}>
                  {existingImages.map((url, index) => (
                    <Grid item key={index}>
                      <Box
                        sx={{
                          position: "relative",
                          width: 100,
                          height: 80,
                          border: "1px solid #ccc",
                          borderRadius: 1,
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          src={url}
                          alt={`Existing Image ${index + 1}`}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                        <IconButton
                          aria-label="delete"
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 2,
                            right: 2,
                            backgroundColor: "rgba(255,255,255,0.7)",
                          }}
                          onClick={() => handleDeleteExistingImage(url)}
                        >
                          <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Cropped Images Preview with Delete Icon */}
            {croppedBlobs.length > 0 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Cropped Images Preview:
                </Typography>
                <Grid container spacing={2}>
                  {croppedBlobs.map((blob, index) => (
                    <Grid item key={index}>
                      <Box
                        sx={{
                          position: "relative",
                          width: 100,
                          height: 80,
                          border: "1px solid #ccc",
                          borderRadius: 1,
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          src={URL.createObjectURL(blob)}
                          alt={`Cropped Preview ${index + 1}`}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                        <IconButton
                          aria-label="delete"
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 2,
                            right: 2,
                            backgroundColor: "rgba(255,255,255,0.7)",
                          }}
                          onClick={() => handleDeleteCroppedBlob(index)}
                        >
                          <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateOrUpdateBlog} variant="contained" color="primary">
            {isEditing ? "Update Blog" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Crop Dialog */}
      {selectedFiles.length > croppedBlobs.length && (
        <CropDialog
          open={openCropDialog}
          file={selectedFiles[croppedBlobs.length]}
          aspect={1200 / 900} // 4:3 ratio
          onClose={() => setOpenCropDialog(false)}
          onCropComplete={handleCropComplete}
        />
      )}
    </Box>
  );
};

export default AdminBlogs;
