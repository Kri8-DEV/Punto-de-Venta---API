const ROLE = require("../config/roleList");
const excludePaths = require("../config/excludePaths");

module.exports.validateUserLevel = (req, res, next) => {
  if (excludePaths.includes(req.path)) return next();

  const roleId = ROLE[req.body.role.toUpperCase()];

  if (roleId == null) return res.status(400).send({ message: "Role no found" });

  if (req.userRole <= roleId) return res.status(403).send({ message: "Forbidden: You need a higher role" });

  req.roleId = roleId;
  next();
}
