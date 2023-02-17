module.exports = (sequelize,Sequelize) => {
  const Product = sequelize.define('products', {
    sku: {
      type: Sequelize.STRING(191),
      primaryKey: true,
      allowNull: false,
      unique: { args: true, msg: "SKU already in use" },
      validate: {
        notNull: { args: true, msg: "SKU cannot be null" }
      }
    },
    name: {
      type: Sequelize.STRING(191),
      allowNull: false,
      unique: { args: true, msg: "Name already in use" },
      validate: {
        notNull: { args: true, msg: "Name cannot be null" },
      }
    },
    description: {
      type: Sequelize.TEXT
    },
    price: {
      type: Sequelize.DECIMAL(10,2),
      defaultValue: 0.00,
      allowNull: false,
      validate: {
        notNull: { args: true, msg: "Price cannot be null" },
      }
    },
    kg_price: {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0.00
    },
    image: {
      type: Sequelize.BLOB,
      allowNull: true,
      defaultValue: null,
      get() {
        return this.getDataValue('image').toString('base64');
      }
    },
    weight: {
      type: Sequelize.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        notNull: { args: true, msg: "Weight cannot be null" },
      }
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  });

  return Product;
}
