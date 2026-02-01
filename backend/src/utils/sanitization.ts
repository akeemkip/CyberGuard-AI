import sanitizeHtml from 'sanitize-html';

/**
 * Sanitize HTML content to prevent XSS attacks
 * Strips all HTML tags except safe ones
 */
export const sanitizeInput = (input: string): string => {
  return sanitizeHtml(input, {
    allowedTags: [], // No HTML tags allowed by default
    allowedAttributes: {},
    disallowedTagsMode: 'discard'
  });
};

/**
 * Sanitize HTML content but allow safe formatting tags
 * Useful for rich text content like course descriptions
 */
export const sanitizeRichText = (input: string): string => {
  return sanitizeHtml(input, {
    allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'a'],
    allowedAttributes: {
      'a': ['href', 'title', 'target']
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    disallowedTagsMode: 'discard'
  });
};

/**
 * Recursively sanitize an object's string values
 * Useful for sanitizing entire request bodies
 */
export const sanitizeObject = (obj: any, richText: boolean = false): any => {
  if (typeof obj === 'string') {
    return richText ? sanitizeRichText(obj) : sanitizeInput(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, richText));
  }

  if (obj !== null && typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Don't sanitize password fields or other sensitive fields that need exact values
        const skipSanitization = ['password', 'token', 'secret'].includes(key.toLowerCase());
        sanitized[key] = skipSanitization ? obj[key] : sanitizeObject(obj[key], richText);
      }
    }
    return sanitized;
  }

  return obj;
};

/**
 * Express middleware to sanitize request body
 */
export const sanitizeBody = (richTextFields: string[] = []) => {
  return (req: any, res: any, next: any) => {
    if (req.body && typeof req.body === 'object') {
      // Sanitize each field
      for (const key in req.body) {
        if (req.body.hasOwnProperty(key)) {
          const isRichTextField = richTextFields.includes(key);
          req.body[key] = sanitizeObject(req.body[key], isRichTextField);
        }
      }
    }
    next();
  };
};
