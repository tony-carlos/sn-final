// app/lib/helpers.js

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[\s\W-]+/g, "-"); // Replace spaces, non-word chars and dashes with a single dash
};
