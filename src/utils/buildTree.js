/**
 * Converts a flat category array from the backend
 * into a nested tree structure for the navbar.
 *
 * @param {Array} categories - flat API array
 * @returns {Array} nested category tree
 */
export function buildNavTree(categories) {
  const map = {}; // id -> category
  const tree = [];

  // 1️⃣ Create map and initialize children arrays
  categories.forEach((cat) => {
    map[cat.id] = {
      id: cat.id,
      tag: cat.name,
      slug: cat.slug,
      children: [],
    };
  });

  // 2️⃣ Populate tree
  categories.forEach((cat) => {
    if (cat.parent_id) {
      const parent = map[cat.parent_id];
      if (parent) {
        parent.children.push(map[cat.id]);
      }
    } else {
      // top-level category
      tree.push(map[cat.id]);
    }
  });

  return tree;
}
