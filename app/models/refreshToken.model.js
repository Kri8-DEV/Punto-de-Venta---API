module.exports = (db) => {
  // Relationships
    db.refreshToken.belongsTo(db.user, {
      foreignKey: 'userId',
      targetKey: 'id'
    });

  // Scopes
}
