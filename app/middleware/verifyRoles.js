module.exports.verifyRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.userRole)) return res.status(403).send({ message: req.t("error.model.auth.user_level.role_insufficient") });
    next();
  }
}
