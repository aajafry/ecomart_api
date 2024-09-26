const couponModel = require('../models/coupon/model');

async function validateCoupon(couponCode) {
    if (!couponCode) return null;

    const coupon = await couponModel.findOne({ code: couponCode });
    if (!coupon) throw new Error("Coupon not found!");
    if (!coupon.isActive) throw new Error("Coupon is not active!");

    const now = new Date();
    if (now > coupon.validTo || now < coupon.validFrom) {
        throw new Error("Coupon is not valid at this time");
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        throw new Error("Coupon Code has reached its usage limit");
    }
    return coupon;
}


module.exports = validateCoupon