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
    createWOO() {
        var WooCommerceAPI = require('woocommerce-api');
        
        var WooCommerce = new WooCommerceAPI({
            url: config.url,
            consumerKey: config.consumerKey,
            consumerSecret: config.consumerSecret,
            wpAPI: config.wpAPI,
            version: config.version
        });
        var dataJSON    = require(__dirname + '/../data/product.json');
        //FIND ALL PRODUCTS DB
        Product.findAll()
        .then(function (result) {
            var productsDB = result;
            //For productsDB
            for (var indexDB = 0; indexDB < productsDB.length; indexDB++) {
                var prodDB = productsDB[indexDB];
                //For dataJSON
                var sw = 0;
                for (var indexWOO = 0; indexWOO < dataJSON.length; indexWOO++) {
                    var prodJSON = dataJSON[indexWOO];
                    // console.log(prodJSON.id + '-' + prodDB.id);
                    if (prodJSON.id == prodDB.id) {
                        sw = 1;
                    }
                }
                if (sw == 0) {
                    //DATA TO INSERT
                    var data = {
                        name: prodDB.name,
                        type: 'simple',
                        regular_price: prodDB.regular_price,
                        // sku: prodDB.id.toString(),
                        // categories: [{id: 1}],
                    };
                    //INSERT JSON VAR
                    var productIdNew = {id:prodDB.id};
                    dataJSON.push(productIdNew);
                    //INSERT WOO
                    WooCommerce.postAsync('products', data)
                    .then(function(result) {
                        console.log('Add product');         
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
                }
            }
            //INSERT JSON FILE
            var fs = require('fs');
            fs.unlink(__dirname + '/../data/product.json', (err) => {
                if (err) throw err;
            });
            fs.appendFile(__dirname + '/../data/product.json', JSON.stringify(dataJSON), (err) => {
                if (err) throw err;
            });
        })
        .catch(function(err) {
            console.log(err);
        });          
    },
};
