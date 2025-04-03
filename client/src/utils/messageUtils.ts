/**
 * Parses button data from the bot response content
 * @param content The content object from the bot message
 * @returns An array of button rows, or an empty array if no buttons found
 */
export function parseButtonsFromContent(content: any) {
  // If content has buttons property, return it
  if (content && content.buttons && Array.isArray(content.buttons)) {
    return content.buttons;
  }
  
  // Otherwise return empty array
  return [];
}