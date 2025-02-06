// /app/hooks/useAllTours.js

'use client'; // Designate as a client component

import { useState, useEffect } from 'react';
import { db } from '@/app/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from 'firebase/firestore';

/**
 * Custom hook to fetch all tours with optional filters.
 *
 * @param {Object} filters - Filter criteria.
 * @returns {Object} - { tours, loading, error }
 */
export const useAllTours = (filters = {}) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      setError(null);

      try {
        let q = query(collection(db, 'tourPackages'), orderBy('basicInfo.tourTitle'));

        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (key === 'tags' && Array.isArray(value) && value.length > 0) {
              q = query(q, where('basicInfo.tags', 'array-contains-any', value));
            } else if (key === 'mainFocusSlugs' && Array.isArray(value) && value.length > 0) {
              q = query(q, where('basicInfo.mainFocus.value', 'in', value));
            } else if (key === 'priceMin' && typeof value === 'number') {
              q = query(q, where('pricing.manual.highSeason.cost', '>=', value));
            } else if (key === 'priceMax' && typeof value === 'number') {
              q = query(q, where('pricing.manual.highSeason.cost', '<=', value));
            } else if (['isFeatured', 'isRecommended', 'isSpecialPackage', 'isDayTrip', 'isOffer', 'isNew'].includes(key)) {
              q = query(q, where(`basicInfo.${key}`, '==', value));
            } else if (key === 'type' && typeof value === 'string') {
              q = query(q, where('basicInfo.mainFocus.value', '==', value));
            } else if (key === 'destinations' && Array.isArray(value) && value.length > 0) {
              q = query(q, where('basicInfo.country.value', 'in', value));
            }
          }
        });

        const querySnapshot = await getDocs(q);
        const fetchedTours = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Perform the same transformation as in your server-side service function
          const transformedData = {
            id: doc.id,
            basicInfo: {
              availability: Array.isArray(data.basicInfo.availability)
                ? data.basicInfo.availability.map((a) => a.months)
                : [],
              carTypes: Array.isArray(data.basicInfo.carTypes)
                ? data.basicInfo.carTypes.map((car) => ({
                    label: car.label,
                    value: car.value,
                  }))
                : [],
              country: data.basicInfo.country
                ? {
                    label: data.basicInfo.country.label,
                    value: data.basicInfo.country.value,
                  }
                : {},
              description: data.basicInfo.description || '',
              durationUnit: data.basicInfo.durationUnit || '',
              durationValue: data.basicInfo.durationValue || 0,
              ends: data.basicInfo.ends || null,
              from: data.basicInfo.from || null,
              groupType: data.basicInfo.groupType || '',
              isDayTrip: data.basicInfo.isDayTrip || false,
              isFeatured: data.basicInfo.isFeatured || false,
              isNew: data.basicInfo.isNew || false,
              isOffer: data.basicInfo.isOffer || false,
              isRecommended: data.basicInfo.isRecommended || false,
              isSpecialPackage: data.basicInfo.isSpecialPackage || false,
              mainFocus: data.basicInfo.mainFocus
                ? {
                    label: data.basicInfo.mainFocus.label,
                    value: data.basicInfo.mainFocus.value,
                  }
                : {},
              maxPeople: data.basicInfo.maxPeople || 0,
              minPeople: data.basicInfo.minPeople || 0,
              tags: Array.isArray(data.basicInfo.tags) ? data.basicInfo.tags : [],
              tourTitle: data.basicInfo.tourTitle,
              slug: data.basicInfo.slug,
              rating: data.basicInfo.rating || 0,
              ratingCount: data.basicInfo.ratingCount || 0,
            },
            itinerary: Array.isArray(data.itinerary)
              ? data.itinerary
                  .map((item, index) => {
                    if (
                      !item.accommodation ||
                      !item.destination ||
                      !item.time ||
                      !item.title
                    ) {
                      console.warn(
                        `Itinerary item ${index + 1} in document ${doc.id} is missing required fields.`
                      );
                      return null;
                    }

                    return {
                      accommodation: {
                        images: Array.isArray(item.accommodation.images)
                          ? item.accommodation.images.map((img) => ({
                              storagePath: img.storagePath || '',
                              url: img.url || '',
                            }))
                          : [],
                        accommodationName: item.accommodation.accommodationName || '',
                        description: item.accommodation.description || '',
                      },
                      destination: {
                        images: Array.isArray(item.destination.images)
                          ? item.destination.images.map((img) => ({
                              storagePath: img.storagePath || '',
                              url: img.url || '',
                            }))
                          : [],
                        destinationName: item.destination.destinationName || '',
                      },
                      meals: Array.isArray(item.meals) ? item.meals : [],
                      time: item.time?.toDate ? item.time.toDate() : null,
                      title: item.title || '',
                    };
                  })
                  .filter(Boolean)
              : [],
            excludes: Array.isArray(data.excludes)
              ? data.excludes.map((exc) => ({
                  label: exc.label || '',
                  values: exc.values || [],
                }))
              : [],
            includes: Array.isArray(data.includes)
              ? data.includes.map((inc) => ({
                  label: inc.label || '',
                  values: inc.values || [],
                }))
              : [],
            images: Array.isArray(data.images)
              ? data.images.map((img) => ({
                  storagePath: img.storagePath || '',
                  url: img.url || '',
                }))
              : [],
            pricing: {
              manual: {
                highSeason: data.pricing?.manual?.highSeason
                  ? {
                      category: data.pricing.manual.highSeason.category || '',
                      cost: data.pricing.manual.highSeason.cost || 0,
                      discount: data.pricing.manual.highSeason.discount || 0,
                    }
                  : null,
                lowSeason: data.pricing?.manual?.lowSeason
                  ? {
                      category: data.pricing.manual.lowSeason.category || '',
                      cost: data.pricing.manual.lowSeason.cost || 0,
                      discount: data.pricing.manual.lowSeason.discount || 0,
                    }
                  : null,
                midSeason: data.pricing?.manual?.midSeason
                  ? {
                      category: data.pricing.manual.midSeason.category || '',
                      cost: data.pricing.manual.midSeason.cost || 0,
                      discount: data.pricing.manual.midSeason.discount || 0,
                    }
                  : null,
              },
            },
            seo: {
              seoTitle_en: data.seo?.seoTitle_en || '',
              seoTitle_DE: data.seo?.seoTitle_DE || '',
              seoDescription_en: data.seo?.seoDescription_en || '',
              seoDescription_DE: data.seo?.seoDescription_DE || '',
              seoKeywords_DE: data.seo?.seoKeywords_DE || '',
              seoKeywords_en: data.seo?.seoKeywords_en || '',
            },
            status: data.status || 'inactive',
          };

          if (!transformedData.basicInfo.slug) {
            console.warn(`Tour ${transformedData.id} is missing slug.`);
            return; // Skip this tour
          }

          fetchedTours.push(transformedData);
        });

        setTours(fetchedTours);
      } catch (err) {
        console.error('Error fetching tours:', err);
        setError('Failed to fetch tours. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [filters]);

  return { tours, loading, error };
};
