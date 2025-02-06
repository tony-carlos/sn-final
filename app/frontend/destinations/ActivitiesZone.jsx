// components/frontend/destinations/ActivitiesZone.jsx

import React from "react";
import { Badge } from "react-bootstrap"; // Using react-bootstrap's Badge component

/**
 * ActivitiesZone Component
 *
 * @param {Object} props - Component props
 * @param {Array<string>} props.activities - Array of activity strings
 * @returns {JSX.Element} - Rendered Activities Zone
 */
const ActivitiesZone = ({ activities }) => {
  // Function to format activity names
  const formatActivityName = (activity) => {
    return activity
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="activities-zone">
      <h3 className="text-24 fw-500 mb-3">Activities</h3>
      <div className="d-flex flex-wrap gap-2">
        {activities.map((activity, index) => (
          <Badge
            key={index}
            bg="accent-1"
            className="text-uppercase fs-"
            style={{ cursor: "default" }}
          >
            {formatActivityName(activity)}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ActivitiesZone;
