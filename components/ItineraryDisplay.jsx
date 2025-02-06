// components/ItineraryDisplay.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Box } from '@mui/material';
import ItineraryItem from './ItineraryItem';

const ItineraryDisplay = ({ tour }) => {
  const { itinerary } = tour || {};

  if (!itinerary || itinerary.length === 0) {
    return (
      <Typography variant="h6" color="textSecondary" align="center">
        No itinerary available for this tour.
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={4}>
        {itinerary.map((item, index) => (
          <Grid item xs={12} key={index}>
            <ItineraryItem item={item} index={index} total={itinerary.length} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

ItineraryDisplay.propTypes = {
  tour: PropTypes.shape({
    itinerary: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        photo: PropTypes.string.isRequired,
        time: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        distance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        maxAltitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        accommodation: PropTypes.shape({
          label: PropTypes.string,
          description: PropTypes.string,
          images: PropTypes.arrayOf(
            PropTypes.shape({
              storagePath: PropTypes.string,
              url: PropTypes.string,
            })
          ),
        }),
        destination: PropTypes.shape({
          destinationName: PropTypes.string,
          images: PropTypes.arrayOf(
            PropTypes.shape({
              storagePath: PropTypes.string,
              url: PropTypes.string,
            })
          ),
        }),
        meals: PropTypes.arrayOf(
          PropTypes.shape({
            value: PropTypes.string,
            label: PropTypes.string,
          })
        ),
      })
    ),
  }).isRequired,
};

export default ItineraryDisplay;
