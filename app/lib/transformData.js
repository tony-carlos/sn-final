// app/lib/transformData.js

export const transformDestination = (doc) => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title || '',
    slug: data.slug || '',
    overview: data.overview || '',
    climate: data.climate || '',
    gettingThere: data.gettingThere || '',
    activities: data.activities || [],
    zone: data.zone || null,
    pricing: data.pricing || [],
    attractions: data.attractions || [],
    commonAnimals: data.commonAnimals || [],
    whenToVisit: data.whenToVisit || '',
    youtubeLink: data.youtubeLink || '',
    type: data.type || null,
    isFeatured: data.isFeatured || false,
    status: data.status || 'Draft',
    seo: data.seo || { title: '', description: '' },
    coordinates: data.coordinates || null,
    images: data.images || [],
    createdAt: data.createdAt ? data.createdAt.toDate() : null,
    updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
  };
};