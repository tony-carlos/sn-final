// components/AccommodationDetails.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid, Box } from '@mui/material';
import Image from 'next/image';

const AccommodationDetails = ({ accommodation }) => {
  const { label, description, images } = accommodation;

  return (
    <Box sx={{ mt: 2 }}>
      {label && (
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Accommodation: {label}
        </Typography>
      )}
      {description && (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          {description}
        </Typography>
      )}
      {images && images.length > 0 && (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {images.map((img, idx) => (
            <Grid item xs={6} sm={4} md={3} key={idx}>
              <Box sx={{ position: 'relative', width: '100%', height: 150 }}>
                <Image
                  src={img.url}
                  alt={`Accommodation Image ${idx + 1}`}
                  layout="fill"
                  objectFit="cover"
                  style={{ borderRadius: 8 }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

AccommodationDetails.propTypes = {
  accommodation: PropTypes.shape({
    label: PropTypes.string,
    description: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        storagePath: PropTypes.string,
        url: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

export default AccommodationDetails;
