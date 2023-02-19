module.exports = (db) => {
  // Relationships
  db.user.hasOne(db.refreshToken, {
    foreignKey: 'userId',
    targetKey: 'id'
  });
  db.refreshToken.belongsTo(db.user, {
    foreignKey: 'userId',
    targetKey: 'id'
  });

  // Scopes
}
