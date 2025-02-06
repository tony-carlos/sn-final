// app/lib/fetchTourBySlug.js

import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

/**
 * Fetches a single tour from Firestore based on the slug.
 *
 * @param {string} slug - The slug of the tour to fetch.
 * @returns {Object|null} - The transformed tour data or null if not found.
 */
export const fetchTourBySlug = async (slug) => {
  try {
    const toursRef = collection(db, "tourPackages");
    const q = query(toursRef, where("basicInfo.slug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn(`No tour found with slug: ${slug}`);
      return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();

    let createdAt = null;
    if (data.createdAt) {
      if (typeof data.createdAt.toDate === "function") {
        createdAt = data.createdAt.toDate();
      } else if (typeof data.createdAt === "string") {
        createdAt = new Date(data.createdAt);
      }
    }

    const transformedData = {
      id: doc.id,
      basicInfo: {
        isFeatured: data.basicInfo?.isFeatured || false,
        isRecommended: data.basicInfo?.isRecommended || false,
        isOffer: data.basicInfo?.isOffer || false,
        isDayTrip: data.basicInfo?.isDayTrip || false,
        isSpecialPackage: data.basicInfo?.isSpecialPackage || false,
        isNew: data.basicInfo?.isNew || false,
        tourTitle: data.basicInfo?.tourTitle || "",
        slug: data.basicInfo?.slug || "",
        description: data.basicInfo?.description || "",
        country: data.basicInfo?.country || { label: "", value: "" },
        mainFocus: data.basicInfo?.mainFocus || { label: "", value: "" },
        carTypes: Array.isArray(data.basicInfo?.carTypes)
          ? data.basicInfo.carTypes.map((car) => ({
              label: car.label || "",
              value: car.value || "",
            }))
          : [],
        availability: Array.isArray(data.basicInfo?.availability)
          ? data.basicInfo.availability
          : [],
        ends: data.basicInfo?.ends || "",
        from: data.basicInfo?.from || "",
        groupType: data.basicInfo?.groupType || "",
        maxPeople: data.basicInfo?.maxPeople || 0,
        minPeople: data.basicInfo?.minPeople || 0,
        rating: data.basicInfo?.rating || 0,
        ratingCount: data.basicInfo?.ratingCount || 0,
        durationValue: data.basicInfo?.durationValue || 0,
        durationUnit: data.basicInfo?.durationUnit || "",
        tags: Array.isArray(data.basicInfo?.tags)
          ? data.basicInfo.tags
          : [],
      },
      itinerary: Array.isArray(data.itinerary)
        ? data.itinerary.map((item) => ({
            title: item.title || "",
            description: item.description || "",
            destination: item.destination || null,
            accommodation: item.accommodation || null,
            meals: Array.isArray(item.meals) ? item.meals : [],
            time: item.time || "",
            distance: item.distance || "",
            maxAltitude: item.maxAltitude || "",
            destinationImages: Array.isArray(item.destinationImages)
              ? item.destinationImages.map((img) => ({
                  storagePath: img.storagePath || "",
                  url: img.url || "",
                }))
              : [],
            accommodationImages: Array.isArray(item.accommodationImages)
              ? item.accommodationImages.map((img) => ({
                  storagePath: img.storagePath || "",
                  url: img.url || "",
                }))
              : [],
          }))
        : [],
      excludes: Array.isArray(data.excludes)
        ? data.excludes.map((ex) => ({
            label: ex.label || "",
            value: ex.value || "",
          }))
        : [],
      includes: Array.isArray(data.includes)
        ? data.includes.map((inc) => ({
            label: inc.label || "",
            value: inc.value || "",
          }))
        : [],
      images: Array.isArray(data.images)
        ? data.images.map((img) => ({
            storagePath: img.storagePath || "",
            url: img.url || "",
          }))
        : [],
      pricing: {
        manual: {
          highSeason: {
            costs: Array.isArray(data.pricing?.manual?.highSeason?.costs)
              ? data.pricing.manual.highSeason.costs.map((costObj) => ({
                  category: costObj.category || "",
                  cost: costObj.cost || 0,
                  discount: costObj.discount || 0,
                }))
              : [],
          },
          lowSeason: {
            costs: Array.isArray(data.pricing?.manual?.lowSeason?.costs)
              ? data.pricing.manual.lowSeason.costs.map((costObj) => ({
                  category: costObj.category || "",
                  cost: costObj.cost || 0,
                  discount: costObj.discount || 0,
                }))
              : [],
          },
          midSeason: {
            costs: Array.isArray(data.pricing?.manual?.midSeason?.costs)
              ? data.pricing.manual.midSeason.costs.map((costObj) => ({
                  category: costObj.category || "",
                  cost: costObj.cost || 0,
                  discount: costObj.discount || 0,
                }))
              : [],
          },
        },
      },
      seo: {
        seoTitle_en: data.seo?.seoTitle_en || "",
        seoTitle_DE: data.seo?.seoTitle_DE || "",
        seoDescription_en: data.seo?.seoDescription_en || "",
        seoDescription_DE: data.seo?.seoDescription_DE || "",
        seoKeywords_en: data.seo?.seoKeywords_en || "",
        seoKeywords_DE: data.seo?.seoKeywords_DE || "",
      },
      createdAt: createdAt,
    };

    // Ensure the slug exists
    if (!transformedData.basicInfo.slug) {
      console.warn(`Tour ${transformedData.id} is missing slug.`);
      return null;
    }

    return transformedData;
  } catch (error) {
    console.error(`Error fetching tour with slug "${slug}":`, error);
    return null;
  }
};
