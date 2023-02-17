module.exports = (db) => {
  // Relationships
  db.person.hasOne(db.user);
  db.user.belongsTo(db.person,{
    foreignKey: {
      name: 'personId',
      allowNull: false
    },
    onDelete: 'CASCADE'
  });

  db.role.hasMany(db.user);
  db.user.belongsTo(db.role,{
    foreignKey: {
      name: 'roleId',
      allowNull: false
    },
    onDelete: 'CASCADE'
  });

  // Scopes
  db.user.addScope('withPassword', {
    attributes: {
      include: ["password"]
    }
  });
}
