// /app/admin/quote/utils/generateSlug.js

const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // Remove invalid characters
      .replace(/\s+/g, "-")         // Replace spaces with hyphens
      .replace(/-+/g, "-");         // Replace multiple hyphens with single hyphen
  };
  
  export default generateSlug;
  