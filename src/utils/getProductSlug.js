// utils/getProductSlug.js
export const getProductSlug = (name) => {
  if (!name || typeof name !== "string") return "";
  return name
    .toLowerCase()                // convert to lowercase
    .trim()                       // remove leading/trailing spaces
    .replace(/[^a-z0-9\s-]/g, "") // remove special characters
    .replace(/\s+/g, "-");        // replace spaces with hyphens
};
