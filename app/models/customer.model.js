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
    attributes: {
      exclude: ["personId", "createdAt", "updatedAt"]
    },
    include: [
      { model: db.person, as: 'person', include: [
        { model: db.address, as: 'address' }
      ] }
    ]
  }, { override: true });

}
