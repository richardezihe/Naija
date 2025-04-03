export function parseButtonsFromContent(content: any) {
  if (!content || !content.buttons || !Array.isArray(content.buttons)) {
    return [];
  }
  
  return content.buttons;
}