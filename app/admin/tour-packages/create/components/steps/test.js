// /app/admin/tour-packages/create/components/steps/Step4SEOIncludes.js

'use client';

import React, { useState, useEffect, useContext } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import nlp from 'compromise';
import CreatableSelect from 'react-select/creatable';

// Import FormContext
import { FormContext } from '../FormContext';

// Predefined SEO Keywords for Tanzania Travel (100 keywords)
const predefinedSEOKeywords = [
  'Safari', 'Adventure', 'Wildlife', 'Nature', 'Explore', 'Hiking',
  'Culture', 'Photography', 'Travel', 'Guided Tours', 'National Parks',
  'Beach', 'Mountains', 'History', 'Local Cuisine', 'Accommodations',
  'Relaxation', 'Luxury', 'Budget', 'Family Friendly', 'Romantic',
  'Eco-Tourism', 'Wildlife Conservation', 'Bird Watching', 'Waterfalls',
  'Scenic Views', 'Adventure Sports', 'Cultural Experiences', 'Local Markets',
  'Photography Tours', 'Stargazing', 'Caving', 'River Rafting', 'Camping',
  'Bird Sanctuaries', 'Safari Lodges', 'Beach Resorts', 'Hiking Trails',
  'Cultural Heritage', 'Historical Sites', 'Wildlife Safaris', 'Boat Tours',
  'Zip Lining', 'Mountain Biking', 'Safari Vehicles', 'Local Guides',
  'Sunsets', 'Sunrises', 'Bird Species', 'Vegetation', 'Landscapes',
  'Nature Reserves', 'Water Activities', 'Night Safaris', 'Cultural Shows',
  'Local Festivals', 'Traditional Dance', 'Artisan Workshops', 'Culinary Tours',
  'Heritage Walks', 'Eco-Lodges', 'Sustainable Tourism', 'Wildlife Photography',
  'Adventure Hiking', 'Historical Walks', 'Local Cuisine Sampling',
  'Nature Trails', 'River Cruises', 'Mountain Climbing', 'Beach Activities',
  'Safari Photography', 'Local Wildlife', 'Nature Conservation', 'Adventure Tours',
  'Cultural Tours', 'Nature Photography', 'Historical Tours', 'Wildlife Exploration',
  'Local Culture', 'Nature Exploration', 'Adventure Expeditions', 'Cultural Heritage Tours',
  'Eco-Friendly Tours', 'Wildlife Observation', 'Adventure Photography',
  'Cultural Immersion', 'Nature Retreats', 'Historical Exploration', 'Wildlife Encounters',
  'Adventure Activities', 'Cultural Excursions', 'Nature Adventures', 'Safari Expeditions',
  'Local Traditions', 'Nature Experiences', 'Wildlife Safaris', 'Cultural Discoveries',
  'Adventure Safaris', 'Nature Journeys', 'Wildlife Journeys', 'Cultural Journeys',
  'Nature and Culture', 'Adventure and Wildlife'
];

// Define Includes Options
const includesOptions = [
  { value: 'All accommodation included in itinerary', label: 'All accommodation included in itinerary' },
  { value: 'Transfers to and from the mountain', label: 'Transfers to and from the mountain' },
  { value: 'National Park entry, camping, climbing and rescue fees', label: 'National Park entry, camping, climbing and rescue fees' },
  { value: 'A fully supported climb (average ratio of support staff to climber is 4:1 in open groups)', label: 'A fully supported climb (average ratio of support staff to climber is 4:1 in open groups)' },
  { value: 'All meals and drinking water on the mountain', label: 'All meals and drinking water on the mountain' },
  { value: 'A private portable toilet – no long drops for you!', label: 'A private portable toilet – no long drops for you!' },
  { value: 'High quality mess and sleeping tents with a comfortable foam mattress', label: 'High quality mess and sleeping tents with a comfortable foam mattress' },
  { value: 'Access to emergency oxygen and first aid kit', label: 'Access to emergency oxygen and first aid kit' },
  { value: 'A certificate documenting your summit ascent', label: 'A certificate documenting your summit ascent' },
  { value: 'Return airport transfers from/to Kilimanjaro International Airport (JRO)', label: 'Return airport transfers from/to Kilimanjaro International Airport (JRO)' },
  { value: 'Full board accommodation at safari lodges as per itinerary', label: 'Full board accommodation at safari lodges as per itinerary' },
  { value: 'Balloon safari in the Serengeti', label: 'Balloon safari in the Serengeti' },
  { value: 'Exclusive use of 4WD safari vehicle and English speaking driver guide', label: 'Exclusive use of 4WD safari vehicle and English speaking driver guide' },
  { value: 'All Park fees and Crater fees', label: 'All Park fees and Crater fees' },
  { value: 'Game drives as indicated in the itinerary', label: 'Game drives as indicated in the itinerary' },
  { value: 'Bottled mineral water while on game drives', label: 'Bottled mineral water while on game drives' },
  { value: '4 nights accommodation in Zanzibar', label: '4 nights accommodation in Zanzibar' },
  { value: 'Domestic flight one-way from JRO to ZNZ', label: 'Domestic flight one-way from JRO to ZNZ' },
  { value: 'Prices are based on 2 people sharing', label: 'Prices are based on 2 people sharing' }
];

// Define Excludes Options
const excludesOptions = [
  { value: 'International flights and visas', label: 'International flights and visas' },
  { value: 'Tips for your guides and crew', label: 'Tips for your guides and crew' },
  { value: 'Personal items', label: 'Personal items' },
  { value: 'Travel insurance (you must be insured, and specifically for treks up to 6000m)', label: 'Travel insurance (you must be insured, and specifically for treks up to 6000m)' },
  { value: 'Your personal trekking gear', label: 'Your personal trekking gear' },
  { value: 'Your personal medicines or prescriptions', label: 'Your personal medicines or prescriptions' },
  { value: 'Snacks on the mountain', label: 'Snacks on the mountain' },
  { value: 'Meals and drinks in Moshi, Arusha and Zanzibar', label: 'Meals and drinks in Moshi, Arusha and Zanzibar' },
  { value: 'Drinks of choice at safari lodges', label: 'Drinks of choice at safari lodges' },
  { value: 'Extra excursions / services available at safari lodges', label: 'Extra excursions / services available at safari lodges' },
  { value: 'Items of a personal nature, such as laundry, phone calls & snacks', label: 'Items of a personal nature, such as laundry, phone calls & snacks' },
  { value: 'Deviation from the safari itinerary provided', label: 'Deviation from the safari itinerary provided' },
  { value: 'Tips and gratuities for guide and lodge staff', label: 'Tips and gratuities for guide and lodge staff' },
  { value: 'Activities in Zanzibar', label: 'Activities in Zanzibar' },
  { value: 'Infrastructure tax Zanzibar', label: 'Infrastructure tax Zanzibar' },
  { value: 'Mandatory travel insurance in Zanzibar ($44 to be paid on arrival)', label: 'Mandatory travel insurance in Zanzibar ($44 to be paid on arrival)' }
];

// Define Supported Languages for SEO Generation
const supportedLanguages = [
  { code: 'DE', label: 'German' } // DeepL
];

const Step4SEOIncludes = ({ isEdit }) => {
  const {
    watch,
    register,
    control,
    formState: { errors },
    setValue,
    getValues,
    trigger,
  } = useFormContext();

  // Access FormContext to get navigation functions and updateFormData
  const { nextStep, prevStep, updateFormData } = useContext(FormContext);

  // Watch necessary fields for SEO generation
  const tourTitle = watch('basicInfo.tourTitle');
  const description = watch('basicInfo.description');
  const tags = watch('basicInfo.tags') || [];
  const itinerary = watch('itinerary') || [];
  const mainFocus = watch('basicInfo.mainFocus') || [];
  const groupType = watch('basicInfo.groupType');
  const country = watch('basicInfo.country');
  const destinations = watch('basicInfo.destinations') || [];
  const from = watch('basicInfo.from');
  const ends = watch('basicInfo.ends');
  const durationValue = watch('basicInfo.durationValue');
  const durationUnit = watch('basicInfo.durationUnit');

  // State to track if SEO has been generated
  const [seoGenerated, setSeoGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Helper function to strip HTML tags
  const stripHtml = (html) => {
    if (!html) return '';
    if (typeof window === 'undefined') return html; // Prevent DOMParser on server
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  // Function to generate SEO Keywords
  const generateSEOTags = () => {
    const keywordsSet = new Set();

    // Add predefined keywords
    predefinedSEOKeywords.forEach((keyword) => keywordsSet.add(keyword));

    // Extract unique words from various fields using compromise
    const fieldsToExtract = [
      tourTitle,
      stripHtml(description),
      tags.map((tag) => tag.text).join(' '),
      groupType,
      mainFocus.map((focus) => focus.value).join(' '),
      country?.label || '',
      from?.label || '',
      ends?.label || '',
      `${durationValue} ${durationUnit}`,
      itinerary.map((day) => `${day.title} ${stripHtml(day.description)}`).join(' '),
    ];

    fieldsToExtract.forEach((text) => {
      if (text) {
        const doc = nlp(text);
        const nouns = doc.nouns().out('array');
        nouns.forEach((word) => {
          const cleanedWord = word.replace(/[^a-zA-Z\s]/g, '').trim();
          if (cleanedWord.length > 3) {
            const capitalizedWord = cleanedWord.charAt(0).toUpperCase() + cleanedWord.slice(1);
            keywordsSet.add(capitalizedWord);
          }
        });
      }
    });

    // Limit to 100 keywords
    return Array.from(keywordsSet).slice(0, 100);
  };

  // Function to generate SEO Title
  const generateSEOTitle = () => {
    let seoTitle = `${tourTitle} | `;
    if (groupType) seoTitle += `${groupType} Tour in `;
    if (country?.label) seoTitle += `${country.label} `;
    if (destinations.length > 0) {
      const destinationsText = destinations.map((dest) => dest.label || dest).join(', ');
      seoTitle += `- Explore ${destinationsText}`;
    }
    return seoTitle.trim();
  };

  // Function to generate SEO Description
  const generateSEODescription = () => {
    let seoDescription = `${stripHtml(description)} `;
    if (itinerary.length > 0) {
      const itineraryText = itinerary.map((day) => `${day.title}: ${stripHtml(day.description)}`).join(' ');
      seoDescription += `Experience an unforgettable journey through our detailed itinerary: ${itineraryText} `;
    }
    if (durationValue && durationUnit) seoDescription += `Duration: ${durationValue} ${durationUnit}. `;
    if (mainFocus.length > 0) {
      const mainFocusText = mainFocus.map((focus) => focus.value || focus).join(', ');
      seoDescription += `Our tours focus on ${mainFocusText}. `;
    }
    if (from?.label) seoDescription += `Starting point: ${from.label}. `;
    if (ends?.label) seoDescription += `Ending point: ${ends.label}. `;
    if (destinations.length > 0) {
      const destinationsText = destinations.map((dest) => dest.label || dest).join(', ');
      seoDescription += `Discover the beauty of ${destinationsText} with our expert guides. `;
    }
    return seoDescription.trim();
  };

  // Function to translate text to German using DeepL API
  const translateTextToGerman = async (text) => {
    try {
      const response = await fetch('/api/translate/deepl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang: 'DE' }),
      });

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        throw new Error(errorData.error || 'Translation failed');
      }

      const data = await response.json();

      return data.translatedText;
    } catch (error) {
      console.error('Translation Error (German):', error);
      toast.error('Translation failed for German.');
      return '';
    }
  };

  // Handler for Generate SEO button
  const handleGenerateSEO = async () => {
    // Removed required field checks to make SEO optional
    setIsGenerating(true);

    try {
      const seoTitle_en = generateSEOTitle();
      const seoDescription_en = generateSEODescription();
      const seoKeywords_en = generateSEOTags();

      // Update English SEO fields with validation options
      setValue('seo.seoTitle_en', seoTitle_en, { shouldValidate: true, shouldDirty: true });
      setValue('seo.seoDescription_en', seoDescription_en, { shouldValidate: true, shouldDirty: true });
      setValue('seo.seoKeywords_en', seoKeywords_en.join(', '), { shouldValidate: true, shouldDirty: true });

      // Update context with generated SEO data
      updateFormData('seo', {
        seoTitle_en,
        seoDescription_en,
        seoKeywords_en: seoKeywords_en.join(', '),
      });

      // Translate to German
      const seoTitle_DE = await translateTextToGerman(seoTitle_en);
      const seoDescription_DE = await translateTextToGerman(seoDescription_en);
      const seoKeywords_DE = await translateTextToGerman(seoKeywords_en.join(', '));

      if (seoTitle_DE && seoDescription_DE && seoKeywords_DE) {
        // Update German SEO fields with validation options
        setValue('seo.seoTitle_DE', seoTitle_DE, { shouldValidate: true, shouldDirty: true });
        setValue('seo.seoDescription_DE', seoDescription_DE, { shouldValidate: true, shouldDirty: true });
        setValue('seo.seoKeywords_DE', seoKeywords_DE, { shouldValidate: true, shouldDirty: true });

        // Update context with German SEO data
        updateFormData('seo', {
          seoTitle_DE,
          seoDescription_DE,
          seoKeywords_DE,
        });
      }

      setSeoGenerated(true);
      toast.success('SEO data generated successfully!');
    } catch (error) {
      console.error('SEO Generation Error:', error);
      toast.error('Failed to generate SEO data.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Initialize SEO fields from existing data in edit mode
  useEffect(() => {
    if (isEdit) {
      const existingSEO = getValues('seo');
      if (existingSEO) {
        setValue('seo.seoTitle_en', existingSEO.seoTitle_en || '', { shouldValidate: true, shouldDirty: true });
        setValue('seo.seoDescription_en', existingSEO.seoDescription_en || '', { shouldValidate: true, shouldDirty: true });
        setValue('seo.seoKeywords_en', existingSEO.seoKeywords_en || '', { shouldValidate: true, shouldDirty: true });
        setValue('seo.seoTitle_DE', existingSEO.seoTitle_DE || '', { shouldValidate: true, shouldDirty: true });
        setValue('seo.seoDescription_DE', existingSEO.seoDescription_DE || '', { shouldValidate: true, shouldDirty: true });
        setValue('seo.seoKeywords_DE', existingSEO.seoKeywords_DE || '', { shouldValidate: true, shouldDirty: true });
        setSeoGenerated(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, getValues, setValue]);

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();

    // Removed validation triggers to make fields optional
    // const isValid = await trigger();
    // if (!isValid) {
    //   toast.error('Please resolve the validation errors before proceeding.');
    //   return;
    // }

    // Update form data in context
    const seoData = {
      seoTitle_en: getValues('seo.seoTitle_en'),
      seoDescription_en: getValues('seo.seoDescription_en'),
      seoKeywords_en: getValues('seo.seoKeywords_en'),
      seoTitle_DE: getValues('seo.seoTitle_DE'),
      seoDescription_DE: getValues('seo.seoDescription_DE'),
      seoKeywords_DE: getValues('seo.seoKeywords_DE'),
      // 'includes' and 'excludes' are handled separately
    };

    updateFormData('seo', seoData);

    // Update includes and excludes separately
    const includesData = getValues('includes');
    const excludesData = getValues('excludes');

    updateFormData('includes', includesData);
    updateFormData('excludes', excludesData);

    nextStep();
  };

  return (
    <form onSubmit={onSubmit} className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">
        Step 4: SEO & Includes
      </h2>

      {/* Includes Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Includes</h3>
        <Controller
          name="includes"
          control={control}
          render={({ field }) => (
            <CreatableSelect
              {...field}
              isMulti
              options={includesOptions}
              placeholder="Select or create includes"
              classNamePrefix="react-select"
              onChange={(value) => field.onChange(value)}
              value={field.value}
            />
          )}
        />
      </div>

      {/* Excludes Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Excludes</h3>
        <Controller
          name="excludes"
          control={control}
          render={({ field }) => (
            <CreatableSelect
              {...field}
              isMulti
              options={excludesOptions}
              placeholder="Select or create excludes"
              classNamePrefix="react-select"
              onChange={(value) => field.onChange(value)}
              value={field.value}
            />
          )}
        />
      </div>

      {/* SEO Title (English) */}
      <div className="mb-4">
        <label htmlFor="seoTitle_en" className="block mb-1 font-semibold">
          SEO Title (English)
        </label>
        <input
          id="seoTitle_en"
          {...register('seo.seoTitle_en')}
          className={`p-2 border rounded w-full ${
            errors.seo?.seoTitle_en ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="SEO Title"
          aria-required="false"
          aria-invalid={errors.seo?.seoTitle_en ? 'true' : 'false'}
        />
        {errors.seo?.seoTitle_en && (
          <p className="text-red-500">{errors.seo.seoTitle_en.message}</p>
        )}
      </div>

      {/* SEO Description (English) */}
      <div className="mb-4">
        <label htmlFor="seoDescription_en" className="block mb-1 font-semibold">
          SEO Description (English)
        </label>
        <textarea
          id="seoDescription_en"
          {...register('seo.seoDescription_en')}
          className={`p-2 border rounded w-full ${
            errors.seo?.seoDescription_en ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="SEO Description"
          rows={4}
          aria-required="false"
          aria-invalid={
            errors.seo?.seoDescription_en ? 'true' : 'false'
          }
        ></textarea>
        {errors.seo?.seoDescription_en && (
          <p className="text-red-500">
            {errors.seo.seoDescription_en.message}
          </p>
        )}
      </div>

      {/* SEO Keywords (English) */}
      <div className="mb-4">
        <label htmlFor="seoKeywords_en" className="block mb-1 font-semibold">
          SEO Keywords (English)
        </label>
        <input
          id="seoKeywords_en"
          {...register('seo.seoKeywords_en')}
          className={`p-2 border rounded w-full ${
            errors.seo?.seoKeywords_en ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="SEO Keywords (comma separated)"
          aria-required="false"
          aria-invalid={errors.seo?.seoKeywords_en ? 'true' : 'false'}
        />
        {errors.seo?.seoKeywords_en && (
          <p className="text-red-500">{errors.seo.seoKeywords_en.message}</p>
        )}
      </div>

      {/* Generate SEO Button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={handleGenerateSEO}
          className={`px-4 py-2 rounded hover:bg-green-700 focus:outline-none ${
            isGenerating || seoGenerated
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-green-600 text-white'
          }`}
          disabled={isGenerating || seoGenerated} // Disable if already generating or generated
        >
          {isGenerating
            ? 'Generating...'
            : seoGenerated
            ? 'SEO Generated'
            : 'Generate SEO'}
        </button>
      </div>

      {/* SEO Fields for German */}
      <div className="mb-6 border-t pt-4">
        <h3 className="text-xl font-semibold mb-4">
          SEO (German)
        </h3>

        {/* SEO Title */}
        <div className="mb-4">
          <label
            htmlFor="seoTitle_DE"
            className="block mb-1 font-semibold"
          >
            SEO Title (German)
          </label>
          <input
            id="seoTitle_DE"
            {...register('seo.seoTitle_DE')}
            className={`p-2 border rounded w-full ${
              errors.seo?.seoTitle_DE ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="SEO Title (German)"
            aria-required="false"
            aria-invalid={
              errors.seo?.seoTitle_DE ? 'true' : 'false'
            }
            disabled // Keep disabled for German fields initially
          />
          {errors.seo?.seoTitle_DE && (
            <p className="text-red-500">
              {errors.seo.seoTitle_DE.message}
            </p>
          )}
        </div>

        {/* SEO Description */}
        <div className="mb-4">
          <label
            htmlFor="seoDescription_DE"
            className="block mb-1 font-semibold"
          >
            SEO Description (German)
          </label>
          <textarea
            id="seoDescription_DE"
            {...register('seo.seoDescription_DE')}
            className={`p-2 border rounded w-full ${
              errors.seo?.seoDescription_DE ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="SEO Description (German)"
            rows={4}
            aria-required="false"
            aria-invalid={
              errors.seo?.seoDescription_DE ? 'true' : 'false'
            }
            disabled // Keep disabled for German fields initially
          ></textarea>
          {errors.seo?.seoDescription_DE && (
            <p className="text-red-500">
              {errors.seo.seoDescription_DE.message}
            </p>
          )}
        </div>

        {/* SEO Keywords */}
        <div className="mb-4">
          <label
            htmlFor="seoKeywords_DE"
            className="block mb-1 font-semibold"
          >
            SEO Keywords (German)
          </label>
          <input
            id="seoKeywords_DE"
            {...register('seo.seoKeywords_DE')}
            className={`p-2 border rounded w-full ${
              errors.seo?.seoKeywords_DE ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="SEO Keywords (German) (comma separated)"
            aria-required="false"
            aria-invalid={
              errors.seo?.seoKeywords_DE ? 'true' : 'false'
            }
            disabled // Keep disabled for German fields initially
          />
          {errors.seo?.seoKeywords_DE && (
            <p className="text-red-500">
              {errors.seo.seoKeywords_DE.message}
            </p>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={prevStep}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default Step4SEOIncludes;
