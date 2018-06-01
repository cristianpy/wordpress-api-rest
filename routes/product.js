var product = require('../controllers/product');

module.exports = function(router) {
    router.get('/productsWOO', product.findAllWOO);
    router.get('/productsDB', product.findAllDB);
    return router;
};