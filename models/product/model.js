const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    basePrice: {
        type: Number,
        required: true,
    },
    offerPrice: {
        type: Number,
        required: false
    },
    shop: { 
        type: String, 
        ref: 'Shop',
        required: false,
    },
    category: { 
        type: String,
        ref: 'Category',
        required: false,
    },
    description: {
        type: String,
        required: false
    },
    stock: {
        type: Number,
        required: false
    },
    sticker: {
        type: String,
        required: false
    },
    tags: {
        type: [String],
        required: false
    },
    soldOut: {
        type: Number,
        required: false,
        default: 0
    },
    thumbnail: {
        type: String,
        required: false
    },
    previewImages: {
        type: [String],
        required: false
    },
    ratings: {
        type: Number,
        required: false,
        default: 0
    },
    reviews: [{
        user: {
            type: Object,
            required: false
        },
        rating: {
            type: Number,
            required: false,
        },
        comment: {
            type: String,
            required: false
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        createdAt:{
            type: Date,
            default: Date.now(),
        }
    }],
}, {
    timestamps: true,
    collection: 'products'
})

const productModel = mongoose.models.Product || mongoose.model('Product', productSchema);
module.exports = productModel;