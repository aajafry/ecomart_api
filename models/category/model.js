const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: false
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: false
    }],
},{
    timestamps: true,
    collection: 'categories'
})

const categoryModel = mongoose.models.Category || mongoose.model('Category', categorySchema);

module.exports = categoryModel;