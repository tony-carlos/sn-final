// /app/utils/priceUtils.js

/**
 * Determines the current season based on today's date.
 *
 * Seasons:
 * - High Season: July, August, Dec 20th - Jan 10th
 * - Low Season: April 1st - May 19th
 * - Mid Season: Rest of the year
 *
 * @returns {string} - 'highSeason', 'lowSeason', or 'midSeason'
 */
export const getCurrentSeason = () => {
    const today = new Date();
    const year = today.getFullYear();
  
    // Define date ranges for each season
    const highSeasonStart1 = new Date(year, 6, 1); // July 1
    const highSeasonEnd1 = new Date(year, 7, 31); // August 31
  
    const highSeasonStart2 = new Date(year, 11, 20); // Dec 20
    const highSeasonEnd2 = new Date(year + 1, 0, 10); // Jan 10 next year
  
    const lowSeasonStart = new Date(year, 3, 1); // April 1
    const lowSeasonEnd = new Date(year, 4, 19); // May 19
  
    // Check High Season (July, August) or Dec 20 - Jan 10
    if (
      (today >= highSeasonStart1 && today <= highSeasonEnd1) ||
      (today >= highSeasonStart2 && today <= highSeasonEnd2)
    ) {
      return 'highSeason';
    }
  
    // Check Low Season (April 1 - May 19)
    if (today >= lowSeasonStart && today <= lowSeasonEnd) {
      return 'lowSeason';
    }
  
    // Else Mid Season
    return 'midSeason';
  };
  
  /**
   * Retrieves the price based on the current season.
   *
   * @param {Object} pricing - Pricing data from the tour.
   * @returns {string} - Formatted price or 'Price Unavailable'
   */
  export const getSeasonalPrice = (pricing) => {
    if (!pricing || !pricing.manual) {
      return 'Price Unavailable';
    }
  
    const currentSeason = getCurrentSeason();
    const costsArray = pricing.manual[currentSeason]?.costs;
  
    if (Array.isArray(costsArray) && costsArray.length > 0) {
      const firstCostEntry = costsArray[0];
      const cost = firstCostEntry?.cost;
  
      if (typeof cost === 'number') {
        return cost.toLocaleString();
      } else if (typeof cost === 'string') {
        const parsedCost = parseFloat(cost);
        return isNaN(parsedCost) ? 'Price Unavailable' : parsedCost.toLocaleString();
      }
    }
  
    return 'Price Unavailable';
  };
  