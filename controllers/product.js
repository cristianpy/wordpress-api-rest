Product = require('../models').Product;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];

module.exports = {
    //findAllWOO
    findAllWOO(req, res) {
        var WooCommerceAPI = require('woocommerce-api');
 
        var WooCommerce = new WooCommerceAPI({
        url: 'http://localhost/wordpress-api/wordpress/index.php/',
        consumerKey: 'ck_373e368d8bc15022d46eca2ab49afe4e0307063a',
        consumerSecret: 'cs_e8087a322617ba8cd89fe4b93f8e997b1d6709f0',
        wpAPI: true,
        version: 'wc/v2'
        });
        WooCommerce.getAsync('products')
        .then(function(result) {
            var products = JSON.parse(result.body);
            res.status(200).send(products);            
        });
    },
    //findAllDB
    findAllDB(req, res) {
      Product.findAll()
        .then(function(result) {
            res.status(200).json(result);
        })
        .catch(function(err) {
            res.status(500).json(err);
        });
  },
};
