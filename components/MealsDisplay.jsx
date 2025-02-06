// components/MealsDisplay.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid, Chip, Box } from '@mui/material';

const MealsDisplay = ({ meals }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
        Meals:
      </Typography>
      <Grid container spacing={1} sx={{ mt: 1 }}>
        {meals.map((meal, idx) => (
          <Grid item key={idx}>
            <Chip label={meal.label} color="secondary" />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

MealsDisplay.propTypes = {
  meals: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default MealsDisplay;
