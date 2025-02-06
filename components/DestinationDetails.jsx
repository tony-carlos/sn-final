// components/DestinationDetails.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Box } from '@mui/material';
import Image from 'next/image';

const DestinationDetails = ({ destination }) => {
  const { destinationName, images } = destination;

  // Display only the first image
  const firstImage = images && images.length > 0 ? images[0] : null;

  return (
    <Box sx={{ mt: 2 }}>
      {destinationName && (
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Destination: {destinationName}
        </Typography>
      )}
      {firstImage && (
        <Box sx={{ position: 'relative', width: '100%', height: 200, mt: 1 }}>
          <Image
            src={firstImage.url}
            alt={`Destination Image`}
            layout="fill"
            objectFit="cover"
            style={{ borderRadius: 8, cursor: 'pointer' }}
          />
        </Box>
      )}
    </Box>
  );
};

DestinationDetails.propTypes = {
  destination: PropTypes.shape({
    destinationName: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        storagePath: PropTypes.string,
        url: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

export default DestinationDetails;
