module.exports = (db) => {
  // Relationships

  // Scopes
  db.product.addScope('defaultScope', {
    order: [
      ['createdAt', 'DESC']
    ],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  }, { override: true });

}
