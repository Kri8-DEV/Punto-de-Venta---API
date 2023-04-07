module.exports = async (db) => {
  // Relationships
  db.user.hasOne(db.expiredAccessToken,{
    foreignKey: {
      name: 'userId',
      targetKey: 'UUID'
    },
  });
  db.expiredAccessToken.belongsTo(db.user,{
    foreignKey: {
      name: 'userId',
      targetKey: 'UUID'
    }
  });

  // Scopes
}
