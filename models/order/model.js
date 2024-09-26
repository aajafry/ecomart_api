const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: { 
        _id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' 
        },
        name: {
            type: String,
        },
        email: {
            type: String,
        }
    },
    carts: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product' 
            },
            name: {
                type: String,
            },
            price: {
                type: Number,
            },
            quantity: {
                type: Number,
                required: true,
            },
            shop: { 
            type: String, 
            required: false,
            },
        },
    ],
    shippingAddress: {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone:{
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        zipCode: {
            type: String,
            required: true,
        },
        orderNote: {
            type: String,
            required: false,
        }
    },
    payment: {
        id: {
            type: String,
            required: false
        },
        method: {
            type: String,
            enum: ['PayPal', 'Credit Card', 'Bank Account', 'Cash On Delivery'],
            default: "Cash On Delivery"
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'refunded'],
            default: 'pending',
        },
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
    }, 
    subTotal: {
        type: Number,
        required: true,
    },
    shippingCost: {
        type: Number,
        required: true,
        default: 0,
    },
    discount: {
        type: Number,
        required: true,
        default: 0,
    },
    finalTotal: {
        type: Number,
        required: true,
    },
    status: { 
        type: String, 
        enum: ['pending', 'shipped', 'delivered', 'refunded', 'canceled'],
        default: 'pending',
    },
    deliveredAt: {
        type: Date,
        required: false,
        default: Date.now() + 3*24*60*60*1000,
    },
    refund:{
        reason: {
            type: String,
            required: false
        },
        id: {
            type: String,
            required: false
        },
        amount: {
            type: Number,
            required: false
        },
        method: {
            type: String,
            required: false
        }
    },
},{
    timestamps: true,
    collection: 'orders'
})

const orderModel = mongoose.models.Order || mongoose.model('Order', orderSchema)
module.exports = orderModel;