// components/ItineraryItem.jsx

import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Box,
  Divider,
  Modal,
  IconButton,
  Slide,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import AccommodationDetails from './AccommodationDetails';
import DestinationDetails from './DestinationDetails';
import MealsDisplay from './MealsDisplay';

const ItineraryItem = ({ item, index, total }) => {
  const {
    title,
    description,
    photo,
    time,
    distance,
    maxAltitude,
    accommodation,
    destination,
    meals,
  } = item;

  const [open, setOpen] = React.useState(false);
  const [modalImage, setModalImage] = React.useState('');

  const handleOpen = (image) => {
    setModalImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setModalImage('');
  };

  return (
    <>
      <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, boxShadow: 3 }}>
        {/* Image Section */}
        <Box sx={{ position: 'relative', width: { xs: '100%', md: '40%' }, height: { xs: 200, md: 'auto' } }}>
          <Image
            src={photo}
            alt={`${title} Photo`}
            layout="fill"
            objectFit="cover"
            onClick={() => handleOpen(photo)}
            style={{ cursor: 'pointer' }}
          />
        </Box>

        {/* Content Section */}
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            {description || 'No description available.'}
          </Typography>
          <Divider sx={{ my: 1 }} />

          {/* Time, Distance, Max Altitude */}
          <Grid container spacing={1} sx={{ mb: 2 }}>
            {time && (
              <Grid item>
                <Chip label={`Time: ${time} hours`} color="primary" />
              </Grid>
            )}
            {distance && (
              <Grid item>
                <Chip label={`Distance: ${distance} km`} color="primary" />
              </Grid>
            )}
            {maxAltitude && (
              <Grid item>
                <Chip label={`Max Altitude: ${maxAltitude} m`} color="primary" />
              </Grid>
            )}
          </Grid>

          {/* Accommodation Details */}
          {accommodation && (
            <AccommodationDetails accommodation={accommodation} />
          )}

          {/* Destination Details */}
          {destination && (
            <DestinationDetails destination={destination} />
          )}

          {/* Meals */}
          {meals && meals.length > 0 && (
            <MealsDisplay meals={meals} />
          )}
        </CardContent>
      </Card>

      {/* Modal for Enlarged Image */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby={`modal-${index}-title`}
        aria-describedby={`modal-${index}-description`}
        closeAfterTransition
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
          <Box
            sx={{
              position: 'relative',
              width: { xs: '90%', md: '60%' },
              bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius: 2,
              p: 2,
            }}
          >
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: 'grey.500',
              }}
            >
              <CloseIcon />
            </IconButton>
            <Image
              src={modalImage}
              alt="Enlarged Image"
              width={800}
              height={450}
              objectFit="contain"
            />
          </Box>
        </Slide>
      </Modal>
    </>
  );
};

ItineraryItem.propTypes = {
  item: PropTypes.shape({
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
  }).isRequired,
  index: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default ItineraryItem;
