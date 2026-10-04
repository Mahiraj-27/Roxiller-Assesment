/**
 * Express middleware factory: validates req.body against a Zod schema.
 * Responds with status 400 and structured error breakdown if validation fails.
 */
const validateRequest = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const issues = result.error.issues || result.error.errors || [];
    const errors = issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed: Check input parameters.',
      errors,
    });
  }

  // Assign sanitized & validated data
  req.body = result.data;
  next();
};

module.exports = validateRequest;
