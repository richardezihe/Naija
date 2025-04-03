export function parseButtonsFromContent(content: any) {
  // Check if content already has buttons property
  if (content && content.buttons) {
    return content.buttons;
  }
  
  // Otherwise return empty array
  return [];
}