export function parseButtonsFromContent(content: any) {
  // Check if the content has buttons property
  if (content && content.buttons && Array.isArray(content.buttons)) {
    return content.buttons;
  }
  
  return [];
}