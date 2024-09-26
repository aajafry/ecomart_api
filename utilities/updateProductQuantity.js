const productModel= require('../models/product/model');

async function updateProductQuantity(id, quantity, isRefund = false) {
    const product = await productModel.findById(id);
    if (!product) throw new Error("Product not found!");

    if (isRefund) {
        product.stock += quantity;
        product.soldOut -= quantity;
    } else {
        product.stock -= quantity;
        product.soldOut += quantity;
    }
    await product.save();
}



module.exports = updateProductQuantity