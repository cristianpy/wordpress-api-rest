var producto = require('../controllers/producto');

module.exports = function(router) {
    router.get('/products', producto.findAll);
    return router;
};