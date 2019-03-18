export const attrs = (node, attrs) => {
  Object.entries(attrs).forEach(([attr, value]) => {
    node.setAttribute(attr, value);
  });
};
