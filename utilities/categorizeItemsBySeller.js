const productModel= require('../models/product/model'),
    shopModel= require('../models/shop/model');

async function categorizeItemsBySeller(items) {
    const itemsWithShop = new Map();
    const itemsWithoutShop = [];

    await Promise.all(
        items.map(async (item) => {
            const product = await productModel.findById(item._id);
            if (!product) throw new Error("product not found!");
            
            const shop = await shopModel.findOne({brand: product?.shop});

            if(shop) {
                // arrige duplicate issue with ship._id (ObjectId) 
                // that's way converted it to string.
                const shopId = shop._id.toString();
                if(!itemsWithShop.has(shopId)) {
                    itemsWithShop.set(shopId, []);
                }
                itemsWithShop.get(shopId).push(item);
            } else if (product.shop === "") {
                itemsWithoutShop.push(item);
            } else {
                throw new Error("Shop not found!");
            }
        })
    )
    return { itemsWithShop, itemsWithoutShop };
}


module.exports = categorizeItemsBySeller