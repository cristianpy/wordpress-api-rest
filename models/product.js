'use strict';
module.exports = (sequelize, DataTypes) => {
  var Product = sequelize.define('Product', {
    id: {
      field: 'PRODUTO',
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      field: 'DESCRICAO',
      type: DataTypes.STRING,
    }
  }, 
  {
    timestamps: false,
    tableName: 'fil010'
  });
  Product.associate = function(models) {};
  return Product;
};