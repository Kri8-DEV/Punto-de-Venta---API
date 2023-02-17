module.exports = (db) => {
  // Relationships
  db.address.hasMany(db.store);
  db.store.belongsTo(db.address,{
    foreignKey: {
      name: 'addressId',
      allowNull: false
    },
    onDelete: 'CASCADE'
  });

  db.user.hasMany(db.store);
  db.store.belongsTo(db.user,{
    foreignKey: {
      name: 'userId',
      allowNull: false
    },
    onDelete: 'CASCADE'
  });

  // Scopes
}
