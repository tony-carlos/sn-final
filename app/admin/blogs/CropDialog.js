// app/components/CropDialog.jsx

"use client";

import React, { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slider,
  Typography,
} from "@mui/material";
import { getCroppedImg } from "./cropImage"; 
import { toast } from "react-toastify";

/**
 * CropDialog Component
 *
 * @param {boolean} open - Controls the visibility of the dialog.
 * @param {File} file - The image file to crop.
 * @param {number} aspect - The aspect ratio for cropping.
 * @param {function} onClose - Callback when the dialog is closed.
 * @param {function} onCropComplete - Callback with the cropped blob upon successful cropping.
 */
const CropDialog = ({ open, file, aspect, onClose, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImageSrc(objectUrl);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);

      // Revoke object URL on cleanup to prevent memory leaks
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [file]);

  const onCropCompleteInternal = useCallback((croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropConfirm = async () => {
    if (!croppedAreaPixels) {
      toast.error("Please select a crop area.");
      return;
    }
    try {
      const croppedBlob = await getCroppedImg(file, croppedAreaPixels);
      onCropComplete(croppedBlob);
      toast.success("Image cropped successfully!");
      onClose();
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Failed to crop the image.");
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
      <DialogTitle>Crop Image</DialogTitle>
      <DialogContent>
        {imageSrc ? (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 400,
              background: "#333",
            }}
          >
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropCompleteInternal}
            />
          </div>
        ) : (
          <Typography color="error">No image selected.</Typography>
        )}
        <div style={{ marginTop: 16 }}>
          <Typography gutterBottom>Zoom</Typography>
          <Slider
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e, zoom) => setZoom(zoom)}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleCropConfirm} variant="contained" color="primary">
          Crop & Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CropDialog;
