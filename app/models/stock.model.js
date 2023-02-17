module.exports = (db) => {
  // Relationships
  db.store.hasMany(db.stock);
  db.stock.belongsTo(db.store,{
    foreignKey: {
      name: 'storeId',
      allowNull: false
    },
    onDelete: 'CASCADE'
  });

  db.product.hasMany(db.stock);
  db.stock.belongsTo(db.product,{
    foreignKey: {
      name: 'productSku',
      allowNull: false
    },
    onDelete: 'CASCADE'
  });
  // Scopes
}
