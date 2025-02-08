/**
 * Generates an array of clues for a given champion using additional fields.
 * Fields used:
 *   - title
 *   - tags (split by semicolon; include all available tags)
 *   - partype
 *   - species
 *   - release year
 *   - region
 */
function generateClues(champion) {
    const clues = [];
    
    if (champion.title) {
      clues.push(champion.title);
    }
    
    if (champion.tags) {
      // Split the tags by semicolon and trim each one.
      const tagArr = champion.tags.split(';').map(s => s.trim());
      tagArr.forEach(tag => {
        if (tag) clues.push(tag);
      });
    }
    
    if (champion.partype) {
      clues.push(champion.partype);
    }
    
    if (champion.species) {
      clues.push(champion.species);
    }
    
    if (champion["release year"]) {
      clues.push(champion["release year"]);
    }
    
    if (champion.region) {
      clues.push(champion.region);
    }
    
    return clues;
  }
  