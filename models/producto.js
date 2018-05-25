'use strict';
module.exports = (sequelize, DataTypes) => {
  var Producto = sequelize.define('Producto', {
    name: DataTypes.STRING,
  }, 
  {
    timestamps: false,
    // paranoid: false,
    // underscored: true,
    tableName: 'productos'
  });
  Producto.associate = function(models) {
    // associations can be defined here
  };
  return Producto;
};