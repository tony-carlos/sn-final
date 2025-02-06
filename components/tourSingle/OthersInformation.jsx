import React from "react";

export default function OthersInformation({ tour }) {
  // Destructure the necessary data from tour.basicInfo
  const {
    durationValue,
    durationUnit,
    maxPeople,
    minPeople,
    groupType,
  } = tour.basicInfo || {};

  return (
    <>
      {/* Duration */}
      <div className="col-lg-3 col-6">
        <div className="d-flex items-center">
          <div className="flex-center size-50 rounded-12 border-1">
            <i className="text-20 icon-clock"></i>
          </div>

          <div className="ml-10">
            <div className="lh-16">Duration</div>
            <div className="text-14 text-light-2 lh-16">
              {durationValue && durationUnit
                ? `${durationValue} ${durationUnit}`
                : "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* Group Size */}
      <div className="col-lg-3 col-6">
        <div className="d-flex items-center">
          <div className="flex-center size-50 rounded-12 border-1">
            <i className="text-20 icon-teamwork"></i>
          </div>

          <div className="ml-10">
            <div className="lh-16">Group Size</div>
            <div className="text-14 text-light-2 lh-16">
              {minPeople && maxPeople
                ? `${minPeople}-${maxPeople} people`
                : maxPeople
                ? `Up to ${maxPeople} people`
                : minPeople
                ? `${minPeople}+ people`
                : "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* Type */}
      <div className="col-lg-3 col-6">
        <div className="d-flex items-center">
          <div className="flex-center size-50 rounded-12 border-1">
            <i className="text-20 icon-birthday-cake"></i>
          </div>

          <div className="ml-10">
            <div className="lh-16">Type</div>
            <div className="text-14 text-light-2 lh-16">
              {groupType || "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* Languages */}
      <div className="col-lg-3 col-6">
        <div className="d-flex items-center">
          <div className="flex-center size-50 rounded-12 border-1">
            <i className="text-20 icon-translate"></i>
          </div>

          <div className="ml-10">
            <div className="lh-16">Languages</div>
            <div className="text-14 text-light-2 lh-16">
              English, French, Germany & Chinese
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
