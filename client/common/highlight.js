module.exports = function highlight(pattern, indices, options = {}) {
  const tagName = options.tagName || 'strong';
  const openingTag = `<${tagName}>`;
  const closingTag = `</${tagName}>`;

  for (let i = indices.length - 1; i >= 0; i--) {
    const [start, end] = indices[i];
    pattern =
      pattern.substring(0, start) +
      openingTag +
      pattern.substring(start, end + 1) +
      closingTag +
      pattern.substring(end + 1, pattern.length);
  }

  return pattern;
};
