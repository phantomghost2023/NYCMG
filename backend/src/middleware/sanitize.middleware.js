const sanitize = (req, res, next) => {
  // Sanitize request body
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  
  // Sanitize request query
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }
  
  // Sanitize request params
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params);
  }
  
  next();
};

const sanitizeObject = (obj) => {
  const sanitized = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      
      // If it's a string, sanitize it
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value);
      }
      // If it's an object, recursively sanitize it
      else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        sanitized[key] = sanitizeObject(value);
      }
      // If it's an array, sanitize each element
      else if (Array.isArray(value)) {
        sanitized[key] = value.map(item => {
          if (typeof item === 'string') {
            return sanitizeString(item);
          } else if (typeof item === 'object' && item !== null) {
            return sanitizeObject(item);
          }
          return item;
        });
      }
      // For other types, keep as is
      else {
        sanitized[key] = value;
      }
    }
  }
  
  return sanitized;
};

const sanitizeString = (str) => {
  // Remove null bytes
  str = str.replace(/\0/g, '');
  
  // Remove potential XSS attack vectors
  str = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  str = str.replace(/javascript:/gi, '');
  str = str.replace(/vbscript:/gi, '');
  str = str.replace(/on\w+="[^"]*"/gi, '');
  str = str.replace(/on\w+='[^']*'/gi, '');
  
  // Trim whitespace
  str = str.trim();
  
  return str;
};

module.exports = sanitize;