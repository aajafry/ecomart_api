const productModel = require('../../models/product/model');
const categoryModel = require('../../models/category/model');
const companyModel = require('../../models/company/model');
const shopModel = require('../../models/shop/model');
const cloudinary = require('../../config/cloudinary');
const orderModel= require('../../models/order/model'); 

const { Types } = require('mongoose');

const companyId = process.env.COMPANY_ID;

const productController = {
    create: async (req, res) => {
        try{
            const shopId = req.user.shopId;
            let { shop, ...productData} = req.body;

            if(shopId) {
                const queryShop = await shopModel.findById(shopId);
                shop = queryShop.brand;
            }

            const product = new productModel({
                ...productData,
                shop
            })

            const populatedProduct = await product.save();

            await Promise.all([
                categoryModel.updateOne({ 
                    name: populatedProduct.category 
                }, { 
                    $push: { 
                        products: populatedProduct._id 
                    } 
                }),
                companyModel.updateOne({ 
                    _id: companyId 
                }, { 
                    $push: { 
                        products: populatedProduct._id 
                    } 
                }),
                shop ? shopModel.updateOne({ 
                    brand: populatedProduct.shop 
                }, { 
                    $push: { 
                        products: populatedProduct._id 
                    } 
                }) : Promise.resolve()
            ]);

            console.log("Product created successfully: ", populatedProduct);

            res.status(201).json({
                message: "Product created successfully",
                product: populatedProduct
            })
        } catch(error) {
            console.error('Error creating product:', error);
            res.status(500).json({
                message: "Server error during product creation",
                error: error.message
            });
        }
    },
    getAll: async (req, res) => {
        try {
            const products = await productModel.find({});
            console.log("products successfully retrieved:", products);
            res.status(200).json({
                message: "products successfully retrieved",
                products
            });
        } catch (error) {
            console.error('Error retrieving products:', error);
            res.status(500).json({
                message: "Server error during product retrieval",
                error: error.message
            });
        }
    },
    findById: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: "ID is required" });
            if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

            const product = await productModel.findById(id);
            if (!product) return res.status(404).json({ message: "product not found" });

            console.log("Product retrieved successfully:", product);
            res.status(200).json({
                message: "Product retrieved successfully",
                product
            });
        } catch (error) {
            console.error('Error retrieving product:', error);
            res.status(500).json({
                message: "Server error during product retrieval",
                error: error.message
            });
        }
    },
    update: async (req, res) => {
    try {
        const { id } = req.params;
        const { category: newCategory, shop: newShop } = req.body;
        if (!id) return res.status(400).json({ message: "ID is required" });
        if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

        const product = await productModel.findById(id);
        if (!product) return res.status(404).json({ message: "product not found" });

        const oldCategory = product.category;
        const oldShop = product.shop;

        const updatedProduct = await productModel.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true }
        );

        if (newCategory) {
                if (oldCategory) {
                    await categoryModel.updateOne(
                        { name: oldCategory.toString() },
                        { $pull: { products: id } }
                    )
                }
                await categoryModel.updateOne(
                    { name: newCategory.toString() }, 
                    { $push: { products: id } }
                );
            }

        if (newShop) {
                if (oldShop) {
                    await shopModel.updateOne(
                        { brand: oldShop.toString() },
                        { $pull: { products: id } }
                    )
                }
                await shopModel.updateOne(
                    { brand: newShop.toString() }, 
                    { $push: { products: id } }
                );
            }    

        console.log("Product updated successfully:", updatedProduct);
        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            message: "Server error during product update",
            error: error.message
        });
    }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: "ID is required" });
            if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

            const product = await productModel.findByIdAndDelete(id);
            if (!product) return res.status(404).json({ message: "product not found" });

            const thumbnailPublicId = product?.thumbnail?.split("/").pop().split(".")[0];
            if(thumbnailPublicId){
                await cloudinary.uploader.destroy(`ecomart/${thumbnailPublicId}`);
            }
            
            const deleteImagePromises = product?.previewImages?.map(async (image) => {
                const imagePublicId = image?.split("/").pop().split(".")[0];
                return imagePublicId ? await cloudinary.uploader.destroy(`ecomart/${imagePublicId}`) : null;
            });
            await Promise.all(deleteImagePromises);

            await Promise.all([
                categoryModel.updateMany(
                    { products: id },
                    { $pull: { products: id } }   
                ),
                companyModel.updateMany(
                    { products: id },
                    { $pull: { products: id } }
                ),
                shopModel.updateMany(
                    { products: id },
                    { $pull: { products: id } }
                )
            ])

            console.log("Product deleted successfully:", product);
            res.status(200).json({
                message: "Product deleted successfully",
                product
            });
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({
                message: "Server error during product deletion",
                error: error.message
            });
        }
    },
    findByShopId: async (req, res) => {
        try{
            const { id } = req.params;
            if(!id) return res.status(400).json({ message: 'Shop ID is required' });
            if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID' });

            const shop = await shopModel.findById(id)
                .populate('products')
                .exec();

            if(!shop) return res.status(404).json({
                message: 'Shop not found'
            });

            console.log("Products fetched successfully");
            res.status(200).json({
                message: 'Products fetched successfully',
                products: shop.products
            });

        } catch(error) {
            console.error('Error during fetching products by shop ID:', error);
            res.status(500).json({
                message: 'Error during fetching products by shop ID',
                error: error.message
            });
        }
    },
    createReview: async (req, res) => {
        try{
            const {  rating, comment, productId, orderId } = req.body;
            const { id, name, email, avatar } = req.user;

            const hasOrder = await orderModel.findById(orderId);
            if(!hasOrder) return res.status(403).json({ message: 'Access denied: you did not order yet' });

            const hasProduct = await productModel.findById(productId);
            if (!hasOrder) return res.status(404).json({ message: 'product not found' });

            const newReview = {
                user: {
                    id,
                    name,
                    email,
                    avatar
                },
                rating,
                comment,
                productId
            };

            const existingReviewIndex = hasProduct.reviews.findIndex(
                review => review.user.id === id
            );

            if(existingReviewIndex !== -1){
                hasProduct.reviews[existingReviewIndex] = newReview;
            } else {
                 hasProduct.reviews.push(newReview);
            }

            const totalRatings = hasProduct.reviews.reduce(
                (sum, review) => sum + review.rating, 
            0);
            hasProduct.ratings = totalRatings / hasProduct.reviews.length;
            
            const populatedProduct = await hasProduct.save();

            const currentReview = populatedProduct.reviews[
                existingReviewIndex !== -1 
                ? existingReviewIndex 
                : populatedProduct.reviews.length - 1
            ];

            res.status(201).json({
                message: "reviwed succesfully",
                review: currentReview
            })
        } catch(error) {
            console.error('Error during creating a review:', error);
            res.status(500).json({
                message: 'Error during creating a review',
                error: error.message
            });
        }
    }
}

module.exports = productController;