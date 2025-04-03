export function parseButtonsFromContent(content: any) {
  if (content.buttons) {
    return content.buttons;
  }
  
  return null;
}