const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
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
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true,
        emum: [
            "admin", 
            "administrator", 
            "moderator", 
            "supervisor", 
            "shop-admin",
            "shop-administrator", 
            "shop-moderator", 
            "shop-supervisor", 
            "customer"
        ],
        default: 'customer'
    },
    avatar: { 
        type: String,
        required: false
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    }]
}, {
    timestamps: true,
    collection: 'users'
});

const userModel = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = userModel;
