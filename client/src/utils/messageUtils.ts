export function parseButtonsFromContent(content: any) {
  // If content has buttons array, return it
  if (content.buttons && Array.isArray(content.buttons)) {
    return content.buttons;
  }
  
  // Otherwise return empty array
  return [];
}