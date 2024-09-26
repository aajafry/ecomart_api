const couponRouter = require('express').Router();
const couponController = require('../../controllers/coupon/controller');
const AuthCheck = require('../../middlewares/AuthCheck');

const rolesAllowedForCouponManagement = [
    "admin", 
    "administrator", 
    "moderator", 
    "supervisor", 
    "shop-admin",
    "shop-administrator", 
    "shop-moderator", 
    "shop-supervisor"
]

const rolesAllowedToViewAllCoupons = [
    "admin", 
    "administrator", 
    "moderator", 
    "supervisor", 
]

const rolesAllowedForCouponQuery = [
    "shop-admin",
    "shop-administrator", 
    "shop-moderator", 
    "shop-supervisor"
]

couponRouter.post('/create', AuthCheck(rolesAllowedForCouponManagement), couponController.create);
couponRouter.get('/', AuthCheck(rolesAllowedToViewAllCoupons), couponController.getAll);
couponRouter.get('/:id', AuthCheck(rolesAllowedForCouponManagement), couponController.findById);
couponRouter.post('/validate', couponController.getValueByCode);
couponRouter.put('/:id', AuthCheck(rolesAllowedForCouponManagement), couponController.update);
couponRouter.delete('/:id', AuthCheck(rolesAllowedForCouponManagement), couponController.delete);
couponRouter.get('/shop/:id', AuthCheck(rolesAllowedForCouponQuery), couponController.findByShopId);

module.exports = couponRouter;