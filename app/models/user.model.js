module.exports = (db) => {
  // Relationships
  db.user.belongsTo(db.person,{
    foreignKey: {
      name: 'personId',
      allowNull: false
    },
    onDelete: 'CASCADE'
  });

  db.user.belongsTo(db.role,{
    foreignKey: {
      name: 'roleId',
      allowNull: false
    },
    onDelete: 'CASCADE'
  });

  db.user.hasOne(db.refreshToken, {
    foreignKey: 'userId',
    targetKey: 'id'
  });

  // Scopes
  db.user.addScope('withPassword', {
    attributes: {
      include: ["password"]
    }
  });
}
