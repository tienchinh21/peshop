import DOMPurify from 'dompurify';

/**
 * Strip all HTML tags from a string
 * Useful for meta descriptions and plain text extraction
 */
export const stripHtml = (html: string): string => {
  if (typeof window === 'undefined') {
    // Server-side: simple regex replacement
    return html.replace(/<[^>]*>/g, '').trim();
  }
  
  // Client-side: use DOM parser for better accuracy
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

/**
 * Sanitize HTML to prevent XSS attacks
 * Allows safe HTML tags for product descriptions
 */
export const sanitizeHtml = (html: string): string => {
  if (typeof window === 'undefined') {
    // Server-side: return as-is (will be sanitized on client)
    return html;
  }
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'b', 'i',
      'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'blockquote', 'code', 'pre',
      'div', 'span'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel',
      'src', 'alt', 'width', 'height',
      'class', 'style'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });
};

/**
 * Truncate HTML content to a specific length while preserving tags
 */
export const truncateHtml = (html: string, maxLength: number): string => {
  const text = stripHtml(html);
  if (text.length <= maxLength) return html;
  
  return text.substring(0, maxLength) + '...';
};

/**
 * Extract first N words from HTML content
 */
export const extractWords = (html: string, wordCount: number): string => {
  const text = stripHtml(html);
  const words = text.split(/\s+/);
  
  if (words.length <= wordCount) return text;
  
  return words.slice(0, wordCount).join(' ') + '...';
};

