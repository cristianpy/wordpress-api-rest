User = require('../models').User;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];

module.exports = {
    //Get all
    findAll(req, res) {
        User.findAll()
        .then(function(result) {
            res.status(200).json(result);
        })
        .catch(function(err) {
            res.status(500).json(err);
        });
    },
    //Get by id
    findById(req, res) {
        User.findById(req.params.id)
        .then(function(result) {
            res.status(200).json(result);
        })
        .catch(function(err) {
            res.status(500).json(err);
        });
    },
    //Create
    create(req, res) {
        var hashedPassword = bcrypt.hashSync(req.body.password, 8);
        User.create({
            name : req.body.name,
            email : req.body.email,
            password : hashedPassword,
            phone: req.body.phone
        })
        .then(function(result) {
            // if user is registered without errors
            // create a token
            var token = jwt.sign({ id: result.id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
        })
        .catch(function(err) {
            res.status(500).json(err);
        });
    },
    //Edit
    update(req, res) {
        User.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        .then(function(result) {
            res.status(200).json(result);
        })
        .catch(function(err) {
            res.status(500).json(err);
        });
    },
    //Delete
    delete(req, res) {
        User.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(function(result) {
            res.status(200).json(result);
        })
        .catch(function(err) {
            res.status(500).json(err);
        });
    },
    //Login
    login(req, res) {
        User.findOne({
            where: {
                email: req.body.email.toString().toLowerCase()
            }
        })
        .then(function (user) {
            if (!user) {
                res.status(404).json({mensaje:"No user found."});
            } else {
                var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);       
                if (passwordIsValid) {
                    // if user is found and password is valid
                    // create a token
                    var token = jwt.sign({ id: user.id }, config.secret, {
                        expiresIn: 86400 // expires in 24 hours
                    });
        
                    // return the information including token as JSON
                    res.status(200).send({ auth: true, token: token });
                } else {
                    res.status(401).send({ auth: false, token: null });
                }
            }
        })
        .catch(function (error) {
            res.status(500).json(error);
        });
    },
    //Logout
    wordpress(req, res) {
        var WooCommerceAPI = require('woocommerce-api');
 
        var WooCommerce = new WooCommerceAPI({
        url: 'http://localhost/wordpress/index.php/wp-json/wp/v2/products/',
        consumerKey: 'ck_d8cb2d9892020095e2f0ad3994e7855c118c3e9a',
        consumerSecret: 'cs_b16a63ca2eccf31eb6346151f12b1b5d9ae47daf',
        wpAPI: true,
        version: 'wc/v2'
        });
        WooCommerce.getAsync('products')
        .then(function(result) {
            res.status(200).send(result);
        });
    },
};
