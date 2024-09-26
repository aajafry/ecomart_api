const orderRouter = require('express').Router();
const orderController = require('../../controllers/order/controller');
const AuthCheck = require('../../middlewares/AuthCheck');

const rolesAllowedForOrderManagement = [
    "admin", 
    "administrator", 
    "moderator", 
    "supervisor",
    "shop-admin",
    "shop-administrator", 
    "shop-moderator", 
    "shop-supervisor"
]

const rolesAllowedToViewForOrder = [
    "admin", 
    "administrator", 
    "moderator", 
    "supervisor", 
    "shop-admin",
    "shop-administrator", 
    "shop-moderator", 
    "shop-supervisor", 
    "customer"
]


orderRouter.post('/create', AuthCheck(["customer"]), orderController.create);
orderRouter.get('/', AuthCheck(rolesAllowedToViewForOrder), orderController.getAll);
orderRouter.get('/tracking/:id', AuthCheck(rolesAllowedToViewForOrder), orderController.trackingById);
orderRouter.put('/updateStatus/:id', AuthCheck(rolesAllowedForOrderManagement), orderController.updateStatus)
orderRouter.put('/applyRefund/:id', AuthCheck(["customer"]), orderController.applyRefund)
orderRouter.put('/acceptRefund/:id', AuthCheck(rolesAllowedForOrderManagement), orderController.acceptRefund)
orderRouter.get('/canceledOrder/:id', AuthCheck(rolesAllowedToViewForOrder), orderController.canceledOrder);


module.exports = orderRouter;