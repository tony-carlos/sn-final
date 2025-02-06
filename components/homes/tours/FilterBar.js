// /app/components/homes/tours/FilterBar.js

'use client'; // Ensure this is a client-side component

import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * FilterBar Component
 *
 * Provides UI controls to apply filters to tours.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.onApplyFilters - Callback to apply filters.
 * @returns {JSX.Element} - Rendered filter bar.
 */
export default function FilterBar({ onApplyFilters }) {
  const [filters, setFilters] = useState({
    isFeatured: false,
    isRecommended: false,
    isSpecialPackage: false,
    isDayTrip: false,
    isOffer: false,
    type: '',
    priceMin: '',
    priceMax: '',
    destinations: [],
    tags: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFilters((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name === 'destinations' || name === 'tags') {
      const options = e.target.options;
      const selected = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selected.push(options[i].value);
        }
      }
      setFilters((prev) => ({
        ...prev,
        [name]: selected,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Construct filters object
    const appliedFilters = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== false && value.length !== 0) {
        if (key === 'priceMin' || key === 'priceMax') {
          appliedFilters[key] = Number(value);
        } else {
          appliedFilters[key] = value;
        }
      }
    });

    onApplyFilters(appliedFilters);
  };

  const handleReset = () => {
    setFilters({
      isFeatured: false,
      isRecommended: false,
      isSpecialPackage: false,
      isDayTrip: false,
      isOffer: false,
      type: '',
      priceMin: '',
      priceMax: '',
      destinations: [],
      tags: [],
    });
    onApplyFilters({});
  };

  return (
    <section className="layout-pt-xl layout-pb-xl bg-accent-1-05">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="d-flex flex-wrap gap-20">
            {/* Featured Checkbox */}
            <label className="checkbox-container">
              <input
                type="checkbox"
                name="isFeatured"
                checked={filters.isFeatured}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Featured
            </label>

            {/* Recommended Checkbox */}
            <label className="checkbox-container">
              <input
                type="checkbox"
                name="isRecommended"
                checked={filters.isRecommended}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Recommended
            </label>

            {/* Special Package Checkbox */}
            <label className="checkbox-container">
              <input
                type="checkbox"
                name="isSpecialPackage"
                checked={filters.isSpecialPackage}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Special Package
            </label>

            {/* Day Trip Checkbox */}
            <label className="checkbox-container">
              <input
                type="checkbox"
                name="isDayTrip"
                checked={filters.isDayTrip}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Day Trip
            </label>

            {/* Offer Checkbox */}
            <label className="checkbox-container">
              <input
                type="checkbox"
                name="isOffer"
                checked={filters.isOffer}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Offer
            </label>

            {/* Type Select */}
            <div className="form-group">
              <label htmlFor="type">Type</label>
              <select
                id="type"
                name="type"
                value={filters.type}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Select Type</option>
                <option value="mountain">Mountain</option>
                <option value="beach">Beach</option>
                <option value="city">City</option>
                {/* Add more options as needed */}
              </select>
            </div>

            {/* Price Min Input */}
            <div className="form-group">
              <label htmlFor="priceMin">Price Min ($)</label>
              <input
                type="number"
                id="priceMin"
                name="priceMin"
                value={filters.priceMin}
                onChange={handleChange}
                className="form-control"
                min="0"
              />
            </div>

            {/* Price Max Input */}
            <div className="form-group">
              <label htmlFor="priceMax">Price Max ($)</label>
              <input
                type="number"
                id="priceMax"
                name="priceMax"
                value={filters.priceMax}
                onChange={handleChange}
                className="form-control"
                min="0"
              />
            </div>

            {/* Destinations Select */}
            <div className="form-group">
              <label htmlFor="destinations">Destinations</label>
              <select
                id="destinations"
                name="destinations"
                multiple
                value={filters.destinations}
                onChange={handleChange}
                className="form-control"
              >
                <option value="ch">Switzerland</option>
                <option value="us">United States</option>
                <option value="fr">France</option>
                <option value="it">Italy</option>
                {/* Add more options as needed */}
              </select>
            </div>

            {/* Tags Select */}
            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <select
                id="tags"
                name="tags"
                multiple
                value={filters.tags}
                onChange={handleChange}
                className="form-control"
              >
                <option value="Adventure">Adventure</option>
                <option value="Nature">Nature</option>
                <option value="Relaxation">Relaxation</option>
                <option value="Cultural">Cultural</option>
                {/* Add more options as needed */}
              </select>
            </div>
          </div>

          <div className="d-flex mt-20">
            <button type="submit" className="btn btn-primary mr-10">
              Apply Filters
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-secondary"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
      <style jsx>{`
        .checkbox-container {
          display: flex;
          align-items: center;
          cursor: pointer;
          user-select: none;
        }
        .checkbox-container input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }
        .checkbox-container .checkmark {
          display: inline-block;
          width: 18px;
          height: 18px;
          background-color: #eee;
          border-radius: 4px;
          margin-right: 8px;
          position: relative;
        }
        .checkbox-container input:checked ~ .checkmark {
          background-color: #09f;
        }
        .checkbox-container .checkmark::after {
          content: "";
          position: absolute;
          display: none;
        }
        .checkbox-container input:checked ~ .checkmark::after {
          display: block;
        }
        .checkbox-container .checkmark::after {
          left: 6px;
          top: 2px;
          width: 5px;
          height: 10px;
          border: solid white;
          border-width: 0 3px 3px 0;
          transform: rotate(45deg);
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        .form-group label {
          margin-bottom: 5px;
        }
        .form-control {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .btn-primary {
          background-color: #09f;
          color: #fff;
        }
        .btn-secondary {
          background-color: #ccc;
          color: #000;
        }
      `}</style>
    </section>
  );
}

FilterBar.propTypes = {
  onApplyFilters: PropTypes.func.isRequired,
};
