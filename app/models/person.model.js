module.exports = (db) => {
  // Relationships
  db.address.hasMany(db.person);
  db.person.belongsTo(db.address,{
    foreignKey: {
      name: 'addressId',
      allowNull: false
    },
    onDelete: 'CASCADE'
  });

  // Scopes
  db.person.addScope('defaultScope', {
    attributes: { exclude: ['addressId', 'createdAt', 'updatedAt'] },
  }, { override: true });
}
