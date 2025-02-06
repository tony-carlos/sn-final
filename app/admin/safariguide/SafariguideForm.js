// /app/admin/safariguide/SafariguideForm.js

"use client";

import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { db, storage } from "@/app/lib/firebase"; // Adjust the import path if necessary
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { toast } from "react-toastify";
import GetAppIcon from "@mui/icons-material/GetApp";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageCropper from "./ImageCropper"; // Import the ImageCropper component
import { generateSlug, ensureUniqueSlug } from "./utils"; // Import helper functions

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

const SafariguideForm = ({ closeDialog, guideToEdit, refreshGuides }) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [croppedImages, setCroppedImages] = useState([]);
  const [seoImage, setSeoImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentCropIndex, setCurrentCropIndex] = useState(0);
  const [cropping, setCropping] = useState(false);
  const [existingImages, setExistingImages] = useState([]); // State to hold existing images

  // Populate form fields if editing
  useEffect(() => {
    if (guideToEdit) {
      reset({
        title: guideToEdit.title,
        description: guideToEdit.description,
        seoTitle: guideToEdit.seo?.title || "",
        seoDescription: guideToEdit.seo?.description || "",
        seoKeywords: guideToEdit.seo?.keywords?.join(", ") || "",
      });
      setExistingImages(guideToEdit.images || []); // Set existing images
      setSeoImage(null);
      setCroppedImages([]);
      setSelectedFiles([]);
      setCurrentCropIndex(0);
      setCropping(false);
    }
  }, [guideToEdit, reset]);

  // Function to generate SEO Title and Keywords
  const generateSEO = () => {
    const title = getValues("title");
    const description = getValues("description");

    if (!title || !description) {
      toast.error(
        "Please provide both title and description to generate SEO metadata."
      );
      return;
    }

    // Simple keyword extraction: take unique words from the title
    const keywords = title
      .split(" ")
      .map((word) => word.toLowerCase())
      .filter(
        (word, index, self) => self.indexOf(word) === index && word.length > 2
      )
      .join(", ");

    // Simple meta description: take the first 150 characters of the description
    const metaDescription =
      description.replace(/<[^>]+>/g, "").substring(0, 150) + "...";

    setValue("seoTitle", title);
    setValue("seoDescription", metaDescription);
    setValue("seoKeywords", keywords);

    toast.success("SEO metadata generated successfully!");
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Generate slug from title
      const baseSlug = generateSlug(data.title);
      const uniqueSlug = await ensureUniqueSlug(
        baseSlug,
        guideToEdit ? guideToEdit.id : null
      );

      let imageUrls = [...existingImages]; // Start with existing images

      // Upload new images if any
      if (croppedImages.length > 0) {
        for (let i = 0; i < croppedImages.length; i++) {
          const file = croppedImages[i];
          const storageRef = ref(
            storage,
            `safariguide/images/${Date.now()}_${file.name}`
          );
          const uploadTask = uploadBytesResumable(storageRef, file);

          // Create a promise to handle the upload process
          const uploadPromise = new Promise((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                // Calculate progress
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                toast.info(
                  `Uploading Image ${i + 1}: ${progress.toFixed(2)}%`,
                  { autoClose: false, toastId: `upload-${i}` }
                );
              },
              (error) => {
                console.error("Error uploading image:", error);
                toast.error("Failed to upload an image.");
                reject(error);
              },
              async () => {
                // Upload completed successfully, get the download URL
                const downloadURL = await getDownloadURL(
                  uploadTask.snapshot.ref
                );
                toast.dismiss(`upload-${i}`);
                toast.success(`Image ${i + 1} uploaded successfully!`);
                resolve(downloadURL);
              }
            );
          });

          const url = await uploadPromise;
          imageUrls.push(url);
        }
      }

      // Upload SEO Image if any
      let seoImageUrl = guideToEdit?.seo?.image || "";
      if (seoImage) {
        // Delete old SEO image if editing
        if (guideToEdit?.seo?.image) {
          const oldSeoImgPath = guideToEdit.seo.image
            .split("/o/")[1]
            .split("?")[0];
          const oldSeoImgRef = ref(storage, decodeURIComponent(oldSeoImgPath));
          await deleteObject(oldSeoImgRef).catch((err) =>
            console.error("Error deleting old SEO image:", err)
          );
        }

        const storageRef = ref(
          storage,
          `safariguide/seo/${Date.now()}_${seoImage.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, seoImage);

        // Handle upload with progress
        const uploadPromise = new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              toast.info(`Uploading SEO Image: ${progress.toFixed(2)}%`, {
                autoClose: false,
                toastId: "upload-seo",
              });
            },
            (error) => {
              console.error("Error uploading SEO image:", error);
              toast.error("Failed to upload SEO image.");
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              toast.dismiss("upload-seo");
              toast.success("SEO Image uploaded successfully!");
              resolve(downloadURL);
            }
          );
        });

        seoImageUrl = await uploadPromise;
      }

      if (guideToEdit) {
        // Update existing guide
        const guideRef = doc(db, "safariguide", guideToEdit.id);
        await updateDoc(guideRef, {
          title: data.title,
          description: data.description,
          slug: uniqueSlug, // Update slug
          images: imageUrls,
          seo: {
            title: data.seoTitle,
            description: data.seoDescription,
            keywords: data.seoKeywords.split(",").map((kw) => kw.trim()),
            image: seoImageUrl,
          },
          updatedAt: new Date(),
        });

        toast.success("Safari Guide updated successfully.");
      } else {
        // Add new guide
        await addDoc(collection(db, "safariguide"), {
          title: data.title,
          description: data.description,
          slug: uniqueSlug, // Set slug
          images: imageUrls,
          seo: {
            title: data.seoTitle,
            description: data.seoDescription,
            keywords: data.seoKeywords.split(",").map((kw) => kw.trim()),
            image: seoImageUrl,
          },
          createdAt: new Date(),
        });

        toast.success("Safari Guide added successfully!");
      }

      reset();
      setSelectedFiles([]);
      setCroppedImages([]);
      setSeoImage(null);
      setExistingImages([]); // Clear existing images after creation
      setCurrentCropIndex(0);
      setCropping(false);
      closeDialog(); // Close the dialog after successful submission
      if (refreshGuides) refreshGuides(); // Refresh the guides table
    } catch (error) {
      console.error("Error submitting form: ", error);
      toast.error("Failed to submit the form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setSelectedFiles(files.slice(0, 2)); // Limit to 2 images
    setCroppedImages([]);
    setCurrentCropIndex(0);
    setCropping(true);
  };

  const handleCroppedImage = (croppedBlob) => {
    if (!croppedBlob) {
      // User cancelled cropping
      setCropping(false);
      setSelectedFiles([]);
      setCroppedImages([]);
      setCurrentCropIndex(0);
      return;
    }
    const file = new File([croppedBlob], selectedFiles[currentCropIndex].name, {
      type: "image/jpeg",
    });
    setCroppedImages((prev) => [...prev, file]);
    const nextIndex = currentCropIndex + 1;
    if (nextIndex < selectedFiles.length) {
      setCurrentCropIndex(nextIndex);
    } else {
      setCropping(false);
    }
  };

  const handleCloseCropper = () => {
    setCropping(false);
    setSelectedFiles([]);
    setCroppedImages([]);
    setCurrentCropIndex(0);
    toast.error("Image cropping cancelled.");
  };

  const handleDeleteExistingImage = async (url) => {
    try {
      // Remove the image URL from existingImages state
      setExistingImages((prev) => prev.filter((img) => img !== url));

      // Delete the image from Firebase Storage
      const imgPath = url.split("/o/")[1].split("?")[0];
      const imgRef = ref(storage, decodeURIComponent(imgPath));
      await deleteObject(imgRef);
      toast.success("Image deleted successfully.");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image.");
    }
  };

  const handleDeleteSelectedImage = (index) => {
    setCroppedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      croppedImages.forEach((img) => URL.revokeObjectURL(img));
    };
  }, [croppedImages]);

  return (
    <Box sx={{ p: 4, backgroundColor: "white", borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom>
        {guideToEdit ? "Edit Safari Guide" : "Add New Safari Guide"}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Title */}
          <Grid item xs={12}>
            <Controller
              name="title"
              control={control}
              defaultValue=""
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title ? errors.title.message : ""}
                />
              )}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              defaultValue=""
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <>
                  <InputLabel>Description</InputLabel>
                  <CKEditor
                    editor={ClassicEditor}
                    data={field.value}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      field.onChange(data);
                    }}
                  />
                  {errors.description && (
                    <Typography color="error" variant="body2">
                      {errors.description.message}
                    </Typography>
                  )}
                </>
              )}
            />
          </Grid>

          {/* Picture Upload */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel htmlFor="images">Pictures (optional)</InputLabel>
              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="images">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<GetAppIcon />}
                  >
                    Upload Images
                  </Button>
                </label>
                <Typography sx={{ ml: 2 }}>
                  {selectedFiles.length > 0
                    ? `${selectedFiles.length} file(s) selected`
                    : "No files selected"}
                </Typography>
              </Box>
            </FormControl>
          </Grid>

          {/* Display Existing Images with Delete Icons */}
          {guideToEdit && existingImages.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Existing Images:
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                {existingImages.map((img, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 100,
                      height: 80,
                      position: "relative",
                      borderRadius: 1,
                      overflow: "hidden",
                      boxShadow: 1,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Existing Image ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        color: "red",
                      }}
                      onClick={() => handleDeleteExistingImage(img)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Grid>
          )}

          {/* Display Cropped Image Thumbnails with Delete Icons */}
          {croppedImages.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                New Cropped Images:
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                {croppedImages.map((img, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 100,
                      height: 80,
                      position: "relative",
                      borderRadius: 1,
                      overflow: "hidden",
                      boxShadow: 1,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Cropped Image ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        color: "red",
                      }}
                      onClick={() => handleDeleteSelectedImage(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Grid>
          )}

          {/* SEO Fields */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              SEO Metadata
            </Typography>
          </Grid>

          {/* SEO Title */}
          <Grid item xs={12}>
            <Controller
              name="seoTitle"
              control={control}
              defaultValue=""
              rules={{ required: "SEO Title is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="SEO Title"
                  fullWidth
                  error={!!errors.seoTitle}
                  helperText={errors.seoTitle ? errors.seoTitle.message : ""}
                />
              )}
            />
          </Grid>

          {/* SEO Description */}
          <Grid item xs={12}>
            <Controller
              name="seoDescription"
              control={control}
              defaultValue=""
              rules={{ required: "SEO Description is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="SEO Description"
                  fullWidth
                  multiline
                  rows={4}
                  error={!!errors.seoDescription}
                  helperText={
                    errors.seoDescription ? errors.seoDescription.message : ""
                  }
                />
              )}
            />
          </Grid>

          {/* SEO Keywords */}
          <Grid item xs={12}>
            <Controller
              name="seoKeywords"
              control={control}
              defaultValue=""
              rules={{ required: "SEO Keywords are required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="SEO Keywords"
                  fullWidth
                  placeholder="Select predefined keywords"
                  error={!!errors.seoKeywords}
                  helperText={
                    errors.seoKeywords ? errors.seoKeywords.message : ""
                  }
                />
              )}
            />
            {/* Predefined Keywords Buttons */}
            <Box sx={{ mt: 1 }}>
              {predefinedKeywords.map((keyword, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                  onClick={() => {
                    const currentKeywords = getValues("seoKeywords");
                    const keywordsArray = currentKeywords
                      ? currentKeywords.split(",").map((kw) => kw.trim())
                      : [];
                    if (!keywordsArray.includes(keyword)) {
                      const updatedKeywords = [...keywordsArray, keyword].join(
                        ", "
                      );
                      setValue("seoKeywords", updatedKeywords);
                    }
                  }}
                >
                  {keyword}
                </Button>
              ))}
            </Box>
          </Grid>

          {/* SEO Image */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel htmlFor="seoImage">SEO Image (optional)</InputLabel>
              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <input
                  id="seoImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        setSeoImage(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{ display: "none" }}
                />
                <label htmlFor="seoImage">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<GetAppIcon />}
                  >
                    Upload SEO Image
                  </Button>
                </label>
                <Typography sx={{ ml: 2 }}>
                  {seoImage ? "SEO Image Selected" : "No file selected"}
                </Typography>
              </Box>
            </FormControl>
          </Grid>

          {/* Generate SEO Button */}
          <Grid item xs={12}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={generateSEO}
              startIcon={<GetAppIcon />}
            >
              Generate SEO Metadata
            </Button>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading
                ? guideToEdit
                  ? "Updating..."
                  : "Submitting..."
                : guideToEdit
                ? "Update"
                : "Submit"}
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Image Cropper Dialog */}
      {cropping && currentCropIndex < selectedFiles.length && (
        <ImageCropper
          imageSrc={URL.createObjectURL(selectedFiles[currentCropIndex])}
          aspect={1200 / 630}
          onCropped={handleCroppedImage}
          onCancel={handleCloseCropper}
        />
      )}

      {/* Handle Cropper Close */}
      {cropping &&
        selectedFiles.length > 0 &&
        currentCropIndex >= selectedFiles.length && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">
              All images cropped and ready for upload.
            </Typography>
          </Box>
        )}
    </Box>
  );
};

export default SafariguideForm;
