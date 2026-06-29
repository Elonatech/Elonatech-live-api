// const { ZodError } = require("zod");

// Generic validation middleware factory
// Pass in a Zod schema, it returns a middleware function
// If validation fails, it sends a 400 with all the error messages
// If it passes, req.body is replaced with the parsed (cleaned) data and we move on
const { ZodError } = require("zod");

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const messages = error.errors.map((e) => e.message);
      return res.status(400).json({ message: "Validation failed", errors: messages });
    }
    next(error);
  }
};

module.exports = validate;


// const validate = (schema) => (req, res, next) => {
//   try {
//     req.body = schema.parse(req.body);
//     next();
//   } catch (error) {
//     if (error.name === "ZodError") {
//       // error.message is a JSON string in this version — parse it to get the array
//       const errors = JSON.parse(error.message).map((e) => e.message);
//       return res.status(400).json({ message: "Validation failed", errors });
//     }
//     next(error);
//   }
// };

