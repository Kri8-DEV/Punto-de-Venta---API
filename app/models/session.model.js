module.exports = async (db) =>{
  // Relationships
  db.user.hasOne(db.session,{
    foreignKey: {
      name: 'userId',
      targetKey: 'UUID'
    },
  });
  db.session.belongsTo(db.user,{
    foreignKey: {
      name: 'userId',
      targetKey: 'UUID'
    }
  });

  // Scopes
}
