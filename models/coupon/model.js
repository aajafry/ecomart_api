    const mongoose = require('mongoose');

    const couponSchema = new mongoose.Schema({
        code: {
            type: String,
            required: true,
            unique: true
        },
        description:{
            type: String,
            required: false
        },
        discountType: {
            type: String,
            required: true,
            enum: ['percentage', 'fixed'],
            default: 'fixed',
        },
        discount: {
            type: Number,
            required: true
        },
        minimumOrderValue: {
            type: Number,
            required: false
        },
        maxiumOrderValue: {
            type: Number,
            required: false
        },
        validFrom: {
            type: Date,
            required: true,
            default: () => Date.now(),
        },
        validTo: {
            type: Date,
            required: true,
            default: () => Date.now() + 7*24*60*60*1000
        },
        usageLimit: {
            type: Number,
            required: false
        },
        usedCount: {
            type: Number,
            required: false
        },
        shop:{
            type: String,
            required: false,
        },
        selectedProduct:{
            type: [String],
            required: false,
            default: []
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true
        }
    },{
        timestamps: true,
        collection: 'coupons'  
    })

const couponModel = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
module.exports = couponModel;