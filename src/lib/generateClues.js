// src/lib/generateClues.js

/**
 * Converts a numeric difficulty into a descriptive label.
 */
function getDifficultyLabel(difficulty) {
    if (difficulty <= 3) return 'Easy';
    else if (difficulty <= 6) return 'Medium';
    else return 'Hard';
  }
  
  /**
   * Generates an array of clues for a given champion.
   * Uses these data points:
   *  - Title (champion.title)
   *  - Primary tag (champion.tags[0])
   *  - Resource type (champion.partype)
   *  - Difficulty (derived from champion.info.difficulty)
   *  - Role (we use the first tag again for this example)
   */
  export function generateClues(champion) {
    const clues = [];
    
    if (champion.title) clues.push(champion.title);
    if (champion.tags && champion.tags.length > 0) clues.push(champion.tags[0]);
    if (champion.partype) clues.push(champion.partype);
    if (champion.info && typeof champion.info.difficulty === 'number') {
      clues.push(getDifficultyLabel(champion.info.difficulty));
    }
    // Optionally add a second tag if available.
    if (champion.tags && champion.tags.length > 1) {
      clues.push(champion.tags[1]);
    }
    
    return clues;
  }
  