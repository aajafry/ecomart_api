const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Types } = require('mongoose');
const userModel = require('../../models/user/model'),
    companyModel = require('../../models/company/model');
const cloudinary = require('../../config/cloudinary');
const generateToken = require('../../utilities/generateToken');

const companyId = process.env.COMPANY_ID;

const customerController = {
    signup: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const customer = new userModel({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                role: 'customer'
            });
            await customer.save();

            await companyModel.updateOne({
                _id: companyId
            }, {
                $push: { customers: customer._id }
            })
            
            console.log("Successfully signed up customer:", customer);
            res.status(201).json({
                message: "Customer successfully signed up",
                customer
            });
        } catch (error) {
            console.error('Error during signup:', error);
            res.status(500).json({
                message: "Server error during signup",
                error: error.message
            });
        }
    },
    login: async (req, res) => {
        try {
            const customer = await userModel.findOne({ 
                email: req.body.email, role: "customer"
            });
            if (customer) {
                const isValidPassword = await bcrypt.compare(req.body.password, customer.password);
                if (isValidPassword) {
                    const payload = {
                        id: customer._id,
                        name: customer.name,
                        email: customer.email,
                        role: customer.role,
                        avatar: customer.avatar
                    };
                    const token = generateToken(payload);
                    console.log("Successfully logged in customer:", token);
                    res.status(200).json({
                        message: 'Successfully logged in',
                        token
                    });
                } else {
                    res.status(401).json({ message: 'Authentication failed!' });
                }
            } else {
                res.status(401).json({ message: 'Authentication failed!' });
            }
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({
                message: "Server error during login",
                error: error.message
            });
        }
    }, 
    getAll: async (req, res) => {
        try {
            const customers = await userModel.find({role: "customer"})
                .populate('orders').exec();
            console.log("Successfully retrieved customers:", customers);
            res.status(200).json({
                message: "Customers successfully retrieved",
                customers
            });
        } catch (error) {
            console.error('Error retrieving customers:', error);
            res.status(500).json({
                message: "Server error during retrieval",
                error: error.message
            });
        }
    },
    findById: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: "ID is required" });
            if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

            const customer = await userModel.findOne({_id: id, role: {$in: 'customer'}})
                .populate('orders').exec();
            if (!customer) return res.status(404).json({
                 message: "Customer not found" 
                });

            console.log("Successfully retrieved customer:", customer);
            res.status(200).json({
                message: "Customer successfully retrieved",
                customer
            });
        } catch (error) {
            console.error('Error retrieving customer:', error);
            res.status(500).json({
                message: "Server error during retrieval",
                error: error.message
            });
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: "ID is required" });
            if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

            if(req.body.password) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.password, salt);
                req.body.password = hashedPassword;
            }

            const customer = await userModel.findOneAndUpdate(
                {_id: id, role: {$in: "customer"}},
                req.body, 
                { new: true }
            )
            if (!customer) return res.status(404).json({ message: "Customer not found" });

            console.log("Successfully updated customer:", customer);
            res.status(200).json({
                message: "Customer successfully updated",
                customer
            });
        } catch (error) {
            console.error('Error updating customer:', error);
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

            const customer = await userModel.findOneAndDelete(
                {_id: id, role: {$in: "customer"}},
            )
            if (!customer) return res.status(404).json({ message: "Customer not found" });

            const avatarPublicId = customer?.avatar?.split("/").pop().split(".")[0];
            if(avatarPublicId) {
                await cloudinary.uploader.destroy(`ecomart/${avatarPublicId}`);
            }

            console.log("Successfully deleted customer:", customer);
            res.status(200).json({
                message: "Customer successfully deleted",
                customer
            });
        } catch (error) {
            console.error('Error deleting customer:', error);
            res.status(500).json({
                message: "Server error during delete",
                error: error.message
            });
        }
    },
};

module.exports = customerController;
