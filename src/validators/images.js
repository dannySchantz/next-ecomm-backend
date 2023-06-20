export function validateImage(data) {
    const validationErrors = {};
  
    if (!data.title || typeof data.title !== 'string') {
      validationErrors.title = 'Title is required and must be a string';
    }
  
    if (!data.file || typeof data.file !== 'string') {
      validationErrors.imageUrl = 'Image URL is required and must be a string';
    }
  
    return validationErrors;
  }
  