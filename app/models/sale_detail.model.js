module.exports = (db) => {
  // Relationships
  db.sale.hasMany(db.saleDetail);
  db.saleDetail.belongsTo(db.sale,{
    foreignKey: {
      name: 'saleId',
      allowNull: false
    },
    onDelete: 'CASCADE'
  });

  db.product.hasMany(db.saleDetail);
  db.saleDetail.belongsTo(db.product,{
    foreignKey: {
      name: 'productSku',
      allowNull: false
    },
    onDelete: 'CASCADE'
  });

  // Scopes
  db.saleDetail.addScope('defaultScope', {
    order: [
      ['createdAt', 'DESC']
    ],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  }, { override: true });

}
