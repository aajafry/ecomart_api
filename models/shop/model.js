const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    logo: {
        type: String,
        required: false
    },
    phone: {
        type: Number,
        required: false,
        unique: true,
        sparse: true
    },
    country: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    zipCode: {
        type: Number,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    overview: {
        type: String,
        required: false
    },
    balance: {
        type: Number,
        required: false,
        default: 0,
    },
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    customers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    }],
    coupons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon',
    }], 
},{
    timestamps: true,
    collection: 'shops'
})


const shopModel = mongoose.models.Shop || mongoose.model('Shop', shopSchema);
module.exports = shopModel;