const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: "ecomart",
    },
    logo: {
        type: String,
        required: false,
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
    shops: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
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
    collection: 'companies'
})

const companyModel = mongoose.models.Company || mongoose.model('Company', companySchema);
module.exports = companyModel;