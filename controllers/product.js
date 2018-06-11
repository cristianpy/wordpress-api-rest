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
            var products = JSON.parse(result.body);
            res.status(200).send(products);            
        })
        .catch(function(err) {
            res.status(500).send(err);            
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
    createWOO(req, res) {
        var WooCommerceAPI = require('woocommerce-api');
        
        var WooCommerce = new WooCommerceAPI({
            url: config.url,
            consumerKey: config.consumerKey,
            consumerSecret: config.consumerSecret,
            wpAPI: config.wpAPI,
            version: config.version
        });
        //FIND ALL PRODUCTS DB
        Product.findAll()
        .then(function (result) {
            var productsDB = result;
            var contador = 0;
            //For productsDB
            for (var indexDB = 0; indexDB < productsDB.length; indexDB++) {
                var prodDB = productsDB[indexDB];
                //For productsWOO
                var sw = 0;
                if (sw == 0) {
                    //DATA TO INSERT
                    var data = {
                        name: prodDB.name,
                        type: 'simple',
                        regular_price: prodDB.regular_price,
                        sku: prodDB.id.toString(),
                        categories: [{id: 1}],
                    };
                    //INSERT WOO
                    WooCommerce.postAsync('products', data)
                    .then(function(result) {
                        console.log('Add product - ' + (contador++));         
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
                }
            }
            res.status(200).send('OK');
        })
        .catch(function(err) {
            res.status(500).send(err); 
        });          
    },
};
