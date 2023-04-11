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
  db.user.addScope('defaultScope', {
    where: {
      active: true
    },
    include: [
      { model: db.role, as: 'role' },
      { model: db.person, as: 'person' }
    ]
  }, { override: true });

  db.user.addScope('withPassword', {
    attributes: {
      include: ["password"]
    }
  });
}
