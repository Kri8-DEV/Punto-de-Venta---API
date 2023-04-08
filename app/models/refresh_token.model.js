module.exports = async (db) =>{
  // Relationships
  db.user.hasOne(db.refreshToken,{
    foreignKey: {
      name: 'userId',
      targetKey: 'UUID'
    },
  });
  db.refreshToken.belongsTo(db.user,{
    foreignKey: {
      name: 'userId',
      targetKey: 'UUID'
    }
  });

  // Scopes
}
