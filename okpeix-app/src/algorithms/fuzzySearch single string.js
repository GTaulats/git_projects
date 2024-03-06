// Allows to search for words approximately similar to the target.
// Returns array of closer objects

export function fuzzySearch(targetWord, filterElements) {
  return filterElements
    .map((filterElement) => {
      const word = filterElement[0].toLowerCase(); // string to check against
      let similarity = 0;
      const maxLength = Math.max(targetWord.length, word.length);
      for (let i = 0; i < maxLength; i++) {
        if (targetWord[i] === word[i]) {
          similarity++;
        }
      }
      return { filterElement, similarity };
    })
    .filter(({ filterElement, similarity }) => similarity > 0) // Remove words with zero similarity
    .sort(
      (a, b) => b.similarity - a.similarity
    ) // Sort by similarity, then by word length
    .map(({ filterElement }) => filterElement); // Extract only the words from the objects
}