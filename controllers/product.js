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
            url: config.url,
            consumerKey: config.consumerKey,
            consumerSecret: config.consumerSecret,
            wpAPI: config.wpAPI,
            version: config.version
        });
        WooCommerce.getAsync('products')
        .then(function(result) {
            var product = JSON.parse(result.body);
            res.status(200).send(product);            
        })
        .catch(function(err) {
            res.status(200).send(err);            
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
    //createWOO
    createWOO() {
        var WooCommerceAPI = require('woocommerce-api');
        
        var WooCommerce = new WooCommerceAPI({
            url: config.url,
            consumerKey: config.consumerKey,
            consumerSecret: config.consumerSecret,
            wpAPI: config.wpAPI,
            version: config.version
        });
        Product.findAll({limit:10})
        // Product.findAll()
        .then(function (result) {
            for (var index = 0; index < result.length; index++) {
                var prodDB = result[index];
                var data = {
                    name: prodDB.name,
                    type: 'simple',
                    regular_price: prodDB.regular_price,
                    description: '',
                    short_description: prodDB.id.toString(),
                    categories: [{id: 1}],
                };
        
                WooCommerce.postAsync('products', data)
                .then(function(result) {
                    console.log("Producto nuevo agregado");         
                })
                .catch(function(err) {
                    console.log(err);
                });
            }
            console.log("Ok!");
        })
        .catch(function(err) {
            console.log(err);
        });
    },
};
