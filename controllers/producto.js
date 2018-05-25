Producto = require('../models').Producto;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];

function eachobject(json) {
    for (let ele in json) {
      if (typeof(json[ele]) == 'object') {
        eachobject(json[ele]);
      } else {
        console.log('ele --> ', ele, ' - ', json[ele]);
        console.log('typo del ele --> ', typeof(json[ele]));
        console.log(' --------------------- ');
      }
    }
  }
module.exports = {
    //findAll
    findAll(req, res) {
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
            var lista = result.body;
            var productos = JSON.parse(result.body);
            res.status(200).send(productos);            
        });
    },
};
