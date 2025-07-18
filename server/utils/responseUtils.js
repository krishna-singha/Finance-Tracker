// /**
//  * Utility functions for standardized API responses
//  */

// // Success response helper
// export const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
//   return res.status(statusCode).json({
//     success: true,
//     message,
//     data
//   });
// };

// // Error response helper
// export const sendError = (res, message = 'Internal server error', statusCode = 500, details = null) => {
//   const response = {
//     success: false,
//     error: message
//   };
  
//   if (details && process.env.NODE_ENV === 'development') {
//     response.details = details;
//   }
  
//   return res.status(statusCode).json(response);
// };

// // Validation error helper
// export const sendValidationError = (res, errors) => {
//   return res.status(400).json({
//     success: false,
//     error: 'Validation failed',
//     errors: Array.isArray(errors) ? errors : [errors]
//   });
// };

// // Not found error helper
// export const sendNotFound = (res, resource = 'Resource') => {
//   return res.status(404).json({
//     success: false,
//     error: `${resource} not found`
//   });
// };

// // Unauthorized error helper
// export const sendUnauthorized = (res, message = 'Unauthorized access') => {
//   return res.status(401).json({
//     success: false,
//     error: message
//   });
// };

// // Forbidden error helper
// export const sendForbidden = (res, message = 'Access forbidden') => {
//   return res.status(403).json({
//     success: false,
//     error: message
//   });
// };

// // Handle async errors wrapper
// export const asyncHandler = (fn) => (req, res, next) => {
//   Promise.resolve(fn(req, res, next)).catch(next);
// };

// // Common error handler for database operations
// export const handleDbError = (error, res, operation = 'Database operation') => {
//   console.error(`${operation} error:`, error);
  
//   // Handle specific MongoDB errors
//   if (error.code === 11000) {
//     const field = Object.keys(error.keyPattern)[0];
//     return sendError(res, `Duplicate entry for ${field}`, 409);
//   }
  
//   if (error.name === 'ValidationError') {
//     const errors = Object.values(error.errors).map(err => err.message);
//     return sendValidationError(res, errors);
//   }
  
//   if (error.name === 'CastError') {
//     return sendError(res, 'Invalid ID format', 400);
//   }
  
//   return sendError(res);
// };

// // User data sanitizer
// export const sanitizeUserData = (user) => {
//   return {
//     id: user._id,
//     firebaseUid: user.firebaseUid,
//     email: user.email,
//     name: user.name,
//     photoURL: user.photoURL,
//   };
// };


export const errorResponse = (res, code, message) => {
  return res.status(code).json({ success: false, message });
};
export const successResponse = (res, data, code = 200) => {
  return res.status(code).json({ success: true, ...data });
};