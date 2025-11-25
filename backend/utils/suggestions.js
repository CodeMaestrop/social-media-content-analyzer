export const generateSuggestions = (text) => {
  const suggestions = [];

  // Remove extra spacing and lowercase for analysis
  const cleaned = text.toLowerCase().trim();

  // 1. Post too long
  if (cleaned.length > 300) {
    suggestions.push("Your content is too long. Shorter posts perform better.");
  }

  // 2. Post too short
  if (cleaned.length < 50) {
    suggestions.push("Your content is too short. Add more context.");
  }

  // 3. Missing emojis
  if (!/(🔥|✨|❤️|😊|🎉)/.test(text)) 
 {
    suggestions.push("Add emojis to make your post more expressive.");
  }

  // 4. Missing hashtags
  if (!text.includes("#")) {
    suggestions.push("Include hashtags to increase discoverability.");
  }

  // 5. Missing CTA
  if (!/click|follow|share|check|visit|learn more/i.test(text)) {
    suggestions.push("Add a call-to-action (CTA) to boost engagement.");
  }

  // 6. Missing punctuation
  if (!/[.!?]/.test(text)) {
    suggestions.push("Add proper punctuation to make your post readable.");
  }

  // If no suggestions, give a positive note
  if (suggestions.length === 0) {
    suggestions.push("Your content looks well-optimized!");
  }

  return suggestions;
};
