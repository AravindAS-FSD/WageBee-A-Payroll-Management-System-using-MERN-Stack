const validateInput = (requiredFields = []) => {
  return (req, res, next) => {
    const missing = requiredFields.filter(field => {
      const val = req.body[field];
      return val === undefined || val === null || val === '';
    });
    if (missing.length) {
      return res.status(400).json({
        message: `Missing required field${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}`
      });
    }
    next();
  };
};

export default validateInput;