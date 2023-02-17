module.exports = (db) => {
  // Relationships

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
