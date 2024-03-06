// Allows to search for words approximately similar to the target.
// Returns array of closer objects

/* filterElements is a 3D array like: [[[string], associatedObject],[...],...]
    2D: List of [[string], associatedObject] (parent). This is the RETURN
    3D: List of [string] words to test against. Any of them will return its parent.

    Each [string] is evaluated against targetWord, saving the highest similarity found.
    Then, sort the parents by highest similarity
*/


export function fuzzySearch(targetWord, filterElements) {
  // console.log("filterElements", filterElements)
  let bestSimilarity = 0;
  return filterElements
    .map((filterElement) => {
      const words = filterElement[0]; // strings to check against
      const maxSimilarity = words.reduce((maxSimilarity, rawWord)=>{  // check max similarity of filterElement
        const word = rawWord.toLowerCase();
        let similarity = 0;
        const maxLength = Math.max(targetWord.length, word.length);
        for (let i = 0; i < maxLength; i++) {
          if (targetWord[i] === word[i]) {
            similarity++;
          }
        }

        // TODO: Bias towards length similarity. Useful for small, precise words
        // y+=4-1.65x, y: similarity, x: difference
        // if (similarity > 0) {
        //   similarity += Math.max(4-1.65*Math.abs(targetWord.length-word.length),0)
        // }
        
        // console.log(similarity)
        // console.log(words, maxSimilarity)
        return Math.max(maxSimilarity, similarity); // Sets maxSimilarity as biggest found
      }, 0)
      // console.log("words: ", words)
      // console.log("maxSimilarity: ", maxSimilarity)
      bestSimilarity = Math.max(bestSimilarity, maxSimilarity); // Updates best
      return { filterElement, maxSimilarity };
    })
    .filter(({ filterElement, maxSimilarity }) => {
      return maxSimilarity > 0
    }) // Remove elements with zero
    .filter(({ filterElement, maxSimilarity }) => {
      return bestSimilarity > 2 ? bestSimilarity <= maxSimilarity + 2 : true
    }) // Remove elements far (up to below 2) from best once reached that threshold

    
    .sort(
      (a, b) => b.maxSimilarity - a.maxSimilarity
    ) // Sort by similarity
    .map(({ filterElement }) => filterElement); // Extract only the elements from the objects
}