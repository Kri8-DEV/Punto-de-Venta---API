const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

module.exports.authToken = (req, res, next) => {
  let token = req.headers["authorization"];

  if(!token?.startsWith("Bearer ")) return res.status(401).send({ message: "Unauthorized" });

  token = token.replace('Bearer ', '');
  jwt.verify(token, config.secret, (err, decoded) => {
    if(err) return res.status(403).send({ message: "Invalid Token" });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};
