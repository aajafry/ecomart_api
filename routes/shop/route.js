const shopRouter = require('express').Router();
const shopController = require('../../controllers/shop/controller');
const AuthCheck = require('../../middlewares/AuthCheck');

const rolesAllowedForShopManagement = [
    "admin", 
    "administrator", 
    "moderator", 
    "supervisor", 
    "shop-admin",
    "shop-administrator", 
    "shop-moderator", 
    "shop-supervisor"
]

shopRouter.post('/register', shopController.register);
shopRouter.post('/login', shopController.login);
shopRouter.get('/', shopController.getAll);
shopRouter.get('/:id', shopController.findById);
shopRouter.put('/:id', AuthCheck(rolesAllowedForShopManagement), shopController.update);
shopRouter.delete('/:id', AuthCheck(rolesAllowedForShopManagement), shopController.delete);

module.exports = shopRouter;