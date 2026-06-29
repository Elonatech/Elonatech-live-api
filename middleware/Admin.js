const jwt = require("jsonwebtoken");

const { token_key } = require("../config/key");

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, token_key);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};


const verifySuperAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user?.role != "superAdmin") {
      return res.status(403).send("Super Admin access is required")
    }
    next();
  });
};

module.exports = { verifyToken, verifySuperAdmin };
