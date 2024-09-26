const couponModel = require('../../models/coupon/model');
const companyModel = require('../../models/company/model');
const shopModel = require('../../models/shop/model');
const { Types } = require('mongoose');


const validateCoupon = require('../../utilities/validateCoupon')

const companyId = process.env.COMPANY_ID;

const couponController = {
    create: async (req, res) => {
        try {
            const shopId = req.user.shopId;
            let {shop, ...couponData } = req.body;

            if(shopId) {
                const queryShop = await shopModel.findById(shopId);
                shop = queryShop.brand;
            }

            const coupon = new couponModel({
                ...couponData,
                shop,
            });
            const populatedCoupon = await coupon.save();

            await Promise.all([
                companyModel.updateOne(
                    { _id: companyId }, {
                        $push: { coupons: populatedCoupon._id }
                    }
                ),
                shop ? shopModel.updateOne(
                    { brand: populatedCoupon.shop }, {
                        $push: {
                            coupons: populatedCoupon._id
                        }
                    }
                ) : Promise.resolve()
            ])

            console.log("Coupon Code successfully created");
            res.status(201).json({
                message: "Coupon Code successfully created",
                coupon: populatedCoupon
            });
        } catch (error) {
            console.error('error during coupon code creation:', error);
            res.status(500).json({
                message: "Server error during coupon code creation",
                error: error.message
            });
        }
    },
    getAll: async (req, res) => {
        try {
            const coupons = await couponModel.find({});
            console.log("Successfully retrieved coupon codes:", coupons);
            res.status(200).json({
                message: "Coupon codes successfully retrieved",
                coupons
            });
        } catch (error) {
            console.error('error during coupon code retrieval:', error);
            res.status(500).json({
                message: "Server error during coupon code retrieval",
                error: error.message
            });
        }
    },
    findById: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: "ID is required" });
            if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });
            
            const coupon = await couponModel.findById(id);
            if (!coupon) return res.status(404).json({ message: "Coupon Code not found" });
            
            console.log("Successfully retrieved coupon code:", coupon);
            res.status(200).json({
                message: "Coupon Code successfully retrieved",
                coupon
            });
        } catch (error) {
            console.error('error during coupon code retrieval:', error);
            res.status(500).json({
                message: "Server error during coupon code retrieval",
                error: error.message
            });
        }
    },
    getValueByCode: async (req, res) => {
        try {
            let coupon = null;
            try {
                coupon = await validateCoupon(req.body.code);
            } catch (error) {
                return res.status(400).json({ message: error.message });
            }

            coupon.usedCount = (coupon.usedCount || 0) + 1;

            await coupon.save();
            res.status(200).json({
                message: 'coupon code value successfully retrieved',
                value: coupon.discount,
                coupon: coupon
            })
        } catch (error) {
            console.error('error during coupon code value retrieval:', error);
            res.status(500).json({
                message: "Server error during coupon code value retrieval",
                error: error.message
            });
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { shop: newShop } = req.body;
            if (!id) return res.status(400).json({ message: "ID is required" });
            if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

            const coupon = await couponModel.findById(id);
            if (!coupon) return res.status(404).json({ message: "Coupon Code not found" });

            const oldShop = coupon.shop;
            const updatedCoupon = await couponModel.findByIdAndUpdate(id, req.body, { new: true });

            if (newShop) {
                if (oldShop) {
                    await shopModel.updateOne(
                        { brand: oldShop.toString() },
                        { $pull: { coupons: id } }
                    );
                }
                await shopModel.updateOne(
                    { brand: newShop.toString() },
                    { $push: { coupons: id } }
                );
            }

            res.status(200).json({
                message: "Coupon Code successfully updated",
                coupon: updatedCoupon
            });
        } catch (error) {
            console.error('Error during coupon code update:', error);
            res.status(500).json({
                message: "Server error during coupon code update",
                error: error.message
            });
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: "ID is required" });
            if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });
            
            const coupon = await couponModel.findByIdAndDelete(id);
            if (!coupon) return res.status(404).json({ message: "Coupon Code not found" });

            await Promise.all([
                companyModel.updateMany(
                    {coupons: id},
                    {$pull: {coupons: id}}
                ),
                shopModel.updateMany(
                    {coupons: id},
                    {$pull: {coupons: id}}
                )
            ])

            console.log("Successfully deleted coupon code:", coupon);
            res.status(200).json({
                message: "Coupon Code successfully deleted",
                coupon
            });
        } catch (error) {
            console.error('error during coupon code deletion:', error);
            res.status(500).json({
                message: "Server error during coupon code deletion",
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
                .populate('coupons')
                .exec();

            if(!shop) return res.status(404).json({
                message: 'Shop not found'
            });

            console.log("coupons fetched successfully");
            res.status(200).json({
                message: 'coupons fetched successfully',
                coupons: shop.coupons
            });

        } catch(error) {
            console.error('Error during fetching coupons by shop ID:', error);
            res.status(500).json({
                message: 'Error during fetching coupons by shop ID',
                error: error.message
            });
        }
    },
}

module.exports = couponController;