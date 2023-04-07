module.exports = (db) => {
  // Relationships
  db.customer.hasOne(db.sale);
  db.sale.belongsTo(db.customer,{
    foreignKey: {
      name: 'customerId',
      allowNull: false
    },
    onDelete: 'CASCADE'
  });

  db.store.hasOne(db.sale);
  db.sale.belongsTo(db.store,{
    foreignKey: {
      name: 'storeId',
      allowNull: false
    },
    onDelete: 'CASCADE'
  });

  // Scopes
  db.sale.addScope('defaultScope', {
    order: [
      ['createdAt', 'DESC']
    ],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  }, { override: true });

}
