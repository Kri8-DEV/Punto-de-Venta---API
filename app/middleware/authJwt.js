const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).send({ message: "Unauthorized. Access Token was expired" });
  }

  return res.sendStatus(401).send({ message: "Unauthorized" });
}

module.exports.authToken = (req, res, next) => {
  let token = req.headers["authorization"];

  if(!token?.startsWith("Bearer ")) return res.status(401).send({ message: "Unauthorized" });

  token = token.replace('Bearer ', '');
  jwt.verify(token, config.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if(err) return res.status(403).send({ message: "Invalid Token" });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};
