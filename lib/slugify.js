/**
 * Converts a title string to a URL-friendly slug for Obsidian filenames.
 * 
 * Transformations applied:
 * - Converts to lowercase for consistency
 * - Normalizes accented characters using NFD decomposition
 * - Removes diacritical marks (á → a, ñ → n, etc.)
 * - Replaces non-alphanumeric characters with hyphens
 * - Trims leading/trailing hyphens
 * 
 * @param {string} text - The title to convert
 * @returns {string} URL-safe slug (e.g., "Fisiopatología del Shock" → "fisiopatologia-del-shock")
 */
function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

module.exports = { slugify };
