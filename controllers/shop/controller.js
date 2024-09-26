const bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken');
const { Types } = require('mongoose');
const shopModel = require('../../models/shop/model'),
    userModel = require('../../models/user/model'),
    companyModel = require('../../models/company/model'),
    productModel = require('../../models/product/model'),
    couponModel = require('../../models/coupon/model');
const cloudinary = require('../../config/cloudinary');
const generateToken = require('../../utilities/generateToken');

const companyId = process.env.COMPANY_ID;

const shopController = {
    register: async (req, res) => {
        try {
            const { 
                userName,
                userEmail,
                userPassword,
                ...shopData
            } = req.body;


            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userPassword, salt);

            const employee = new userModel({
                name: userName,
                email: userEmail,
                password: hashedPassword,
                role: "shop-admin"
            })
            await employee.save();

            console.log("successfully registered an employee", employee);

            const shop = new shopModel({
                ...shopData,
                employees: [employee._id]
            });
            await shop.save();

            await companyModel.updateOne({
                _id: companyId
            }, {
                $push: { shops: shop._id }
            })

            console.log("successfully registered shop", shop);
            res.status(201).json({
                message: "shop and employee successfully registered",
                shop,
                employee
            });
        } catch (error) {
            console.error('error during shop registration:', error);
            res.status(500).json({
                message: "server error during shop registration",
                error: error.message
            });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const allowedRoles = [
                "shop-admin", 
                "shop-administrator", 
                "shop-moderator", 
                "shop-supervisor"
            ];

            const employee = await userModel.findOne({ email, role: {$in: allowedRoles } });
            if (!employee) return res.status(401).json({ message: 'Authentication Failed!' });

            const shop = await shopModel.findOne({ employees: employee._id })
            console.log("shop:", shop);
            if (!shop) return res.status(401).json({ message: 'Authentication Failed!' });

            const isValidPassword = await bcrypt.compare(password, employee.password);
            if (!isValidPassword) return res.status(401).json({ message: 'Authentication Failed!!'});

            const payload = {
                id: employee._id,
                name: employee.name,
                email: employee.email,
                role: employee.role,
                avatar: employee.avatar,
                shopId: shop._id
            }
            const token = generateToken(payload);

            console.log("Successfully logged in shop employee", token);
            res.status(200).json({
                message: 'Successfully logged in shop employee',
                token
            });
        } catch (error) {
            console.error('error during logged in shop employee:', error);
            res.status(500).json({
                message: "server error during logged in shop employee",
                error: error.message
            });
        }
    },
    getAll: async (req, res) => {
        try {
            const shops = await shopModel.find()
                .populate('employees')
                .populate('customers')
                .populate('products')
                .populate('orders')
                .populate('coupons')
                .exec();
            console.log("Successfully retrieved shops:", shops);
            res.status(200).json({
                message: "shops successfully retrieved",
                shops
            });
        } catch (error) {
            console.error('error retrieving shops:', error);
            res.status(500).json({
                message: "server error during retrieval",
                error: error.message
            });
        }
    },
    findById: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: "ID is required" });
            if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

            const shop = await shopModel.findById(id)
                .populate('employees')
                .populate('customers')
                .populate('products')
                .populate('orders')
                .populate('coupons')
                .exec();
            if (!shop) return res.status(404).json({ message: "shop not found" });
            
            console.log("Successfully retrieved shop:", shop);
            res.status(200).json({
                message: "shop successfully retrieved",
                shop
            });
        } catch (error) {
            console.error('error retrieving shop:', error);
            res.status(500).json({
                message: "server error during retrieval",
                error: error.message
            });
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: "ID is required" });
            if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

            const shop = await shopModel.findByIdAndUpdate(id, req.body, { new: true });
            if (!shop) return res.status(404).json({ message: "shop not found" });

            console.log("Successfully updated category:", shop);
            res.status(200).json({
                message: "shop successfully updated",
                shop
            });
        } catch (error) {
            console.error('Error updating shop:', error);
            res.status(500).json({
                message: "Server error during update",
                error: error.message
            });
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: "ID is required" });
            if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

            const shop = await shopModel.findByIdAndDelete(id);
            if (!shop) return res.status(404).json({ message: "shop not found" });

            const logoPublicId = shop?.logo?.split("/").pop().split(".")[0];
            if(logoPublicId){
                await cloudinary.uploader.destroy(`ecomart/${logoPublicId}`);
            }

            await Promise.all([
                ...shop.employees.map(async (employeeId) => {
                    await userModel.findByIdAndDelete(employeeId);
                }),
                ...shop.products.map(async (productId) => {
                    await productModel.findByIdAndDelete(productId);
                }),
                ...shop.coupons.map(async (couponId) => {
                    await couponModel.findByIdAndDelete(couponId);
                }),
            ]);

            await companyModel.updateOne(
                { _id: companyId },
                { $pull: { shops: id } }
            )

            console.log("Successfully deleted shop:", shop);
            res.status(200).json({
                message: "shop successfully deleted",
                shop
            });
        } catch (error) {
            console.error('Error deleting shop:', error);
            res.status(500).json({
                message: "Server error during delete",
                error: error.message
            });
        }
    },
}

module.exports = shopController;