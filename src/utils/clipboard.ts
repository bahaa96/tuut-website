/**
 * Copy text to clipboard with fallback methods
 * Handles cases where Clipboard API is blocked by permissions policy
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Method 1: Try Clipboard API (modern browsers with permissions)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.log('Clipboard API failed, trying fallback method');
    }
  }

  // Method 2: Fallback to execCommand (works in more contexts)
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make the textarea invisible but accessible
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.setAttribute('readonly', '');
    
    document.body.appendChild(textArea);
    
    // Select the text
    textArea.select();
    textArea.setSelectionRange(0, 99999); // For mobile devices
    
    // Copy the text
    const successful = document.execCommand('copy');
    
    // Clean up
    document.body.removeChild(textArea);
    
    return successful;
  } catch (err) {
    console.error('Failed to copy text:', err);
    return false;
  }
}
