'use strict';

const SPACE = 0x20;

const last = array => array[array.length - 1];
const firstAndLast = array => [array[0], last(array)];
const isEmpty = array => !array.length;

module.exports = function getFuzzyMatches(haystack, needle, options = {}) {
  const hlen = haystack.length;
  const nlen = needle.length;
  const matches = [];
  let adjacent = [];

  if (!options.caseSensitive) {
    haystack = haystack.toLowerCase();
    needle = needle.toLowerCase();
  }

  /* eslint-disable */
  outer: for (let i = 0, j = 0; i < nlen; i++) {
    const nch = needle.charCodeAt(i);
    if (nch === SPACE) continue;
    while (j < hlen) {
      if (nch === haystack.charCodeAt(j++)) {
        if (isEmpty(adjacent) || last(adjacent) + 1 === j - 1) {
          adjacent.push(j - 1);
        } else {
          matches.push(firstAndLast(adjacent));
          adjacent = [j - 1];
        }
        continue outer;
      }
    }
    return [];
  }

  if (!isEmpty(adjacent)) matches.push(firstAndLast(adjacent));
  return matches;
};
