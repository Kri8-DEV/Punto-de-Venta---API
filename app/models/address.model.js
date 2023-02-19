module.exports = (db) => {
  // Relationships

  // Scopes
  db.address.addScope('defaultScope', {
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  }, { override: true });
}
