module.exports = (db) => {
  // Relationships
  db.role.hasMany(db.user);

  // Scopes
  db.role.addScope('defaultScope', {
    order: [
      ['createdAt', 'DESC']
    ],
    attributes: {
      exclude: ["createdAt", "updatedAt"]
    }
  }, { override: true });
}
