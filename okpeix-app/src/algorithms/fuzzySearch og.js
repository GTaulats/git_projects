/* Used for any performed search */

export function fuzzySearch(targetWord, wordArray) {
  return wordArray
    .map((word) => {
      let similarity = 0;
      const maxLength = Math.max(targetWord.length, word.length);
      for (let i = 0; i < maxLength; i++) {
        if (targetWord[i] === word[i]) {
          similarity++;
        }
      }
      return { word, similarity };
    })
    .filter(({ word, similarity }) => similarity > 0) // Remove words with zero similarity
    .sort(
      (a, b) => b.similarity - a.similarity || a.word.length - b.word.length
    ) // Sort by similarity, then by word length
    .map(({ word }) => word); // Extract only the words from the objects
}