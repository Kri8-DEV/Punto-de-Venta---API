module.exports = (db) => {
  // Relationships
  db.person.hasOne(db.customer);
  db.customer.belongsTo(db.person,{
    foreignKey: {
      name: 'personId',
      allowNull: false
    },
    onDelete: 'CASCADE'
  });

  // Scopes
  db.customer.addScope('defaultScope', {
    order: [
      ['createdAt', 'DESC']
    ],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  }, { override: true });

}
