var product = require('../controllers/product');

module.exports = function(router) {
    router.get('/productsWOO', product.findAllWOO);
    router.post('/createWOO', product.createWOO);
    router.get('/productsDB', product.findAllDB);
    return router;
};