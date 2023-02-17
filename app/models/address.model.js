module.exports = (db) => {
  // Relationships
  db.address.hasMany(db.person);

  // Scopes
  db.address.addScope('defaultScope', {
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  }, { override: true });
}
