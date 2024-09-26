const productRouter = require('express').Router();
const productController = require('../../controllers/product/controller');
const AuthCheck = require('../../middlewares/AuthCheck');

const rolesAllowedForProductManagement = [
    "admin", 
    "administrator", 
    "moderator", 
    "supervisor", 
    "shop-admin",
    "shop-administrator", 
    "shop-moderator", 
    "shop-supervisor"
]
const rolesAllowedForProductQuery = [
    "shop-admin",
    "shop-administrator", 
    "shop-moderator", 
    "shop-supervisor"
]

productRouter.post('/create', AuthCheck(rolesAllowedForProductManagement), productController.create);
productRouter.get('/', productController.getAll);
productRouter.get('/:id', productController.findById);
productRouter.put('/:id', AuthCheck(rolesAllowedForProductManagement), productController.update);
productRouter.delete('/:id', AuthCheck(rolesAllowedForProductManagement), productController.delete);
productRouter.get('/shop/:id', AuthCheck(rolesAllowedForProductQuery), productController.findByShopId);
productRouter.post('/create-review', AuthCheck(["customer"]), productController.createReview);

module.exports = productRouter;