const bcrypt = require('bcrypt');
const { Types } = require('mongoose');
const userModel = require('../../models/user/model'),
    shopModel = require('../../models/shop/model'),
    companyModel = require('../../models/company/model');
const cloudinary = require('../../config/cloudinary');


const employeeController = {
    create: async (req, res) => {
        try {
            const {
                name, 
                email,
                password,
                role,
            } = req.body;

            const companyId = req.user.companyId;
            const shopId = req.user.shopId;

            if(!companyId && !shopId) {
                return res.status(400).json({ 
                    message: 'Either Company ID or Shop ID is required' 
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const employee = new userModel({
                name,
                email,
                password: hashedPassword,
                role,
            })
            await employee.save();

            if(companyId) {
                const company = await companyModel.findById(companyId);
                if(!company) {
                    return res.status(404).json({ message: 'Company not found' });
                }
                company.employees.push(employee._id);
                await company.save()
            }

            if(shopId) {
                const shop = await shopModel.findById(shopId);
                if(!shop) {
                    return res.status(404).json({ message: 'Shop not found' });
                }
                shop.employees.push(employee._id);
                await shop.save()
            }
            
            console.log('Employee created successfully', employee);
            res.status(201).json({
                message: 'Employee created successfully',
                employee 
            });
        } catch (error) {
            console.error('Error during employee creation:', error);
            res.status(500).json({
                message: 'Error during employee creation',
                error: error.message
            });
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: 'ID is required' });
            if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID' });

            if(req.body.password) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.password, salt);
                req.body.password = hashedPassword;
            }
            
            const employee = await userModel.findOneAndUpdate(
                {_id: id, role: {$ne: "customer"}},
                req.body,
                { new: true }
            );
            if (!employee) return res.status(404).json({ message: 'Employee not found' });
            
            console.log('Employee updated successfully', employee);
            res.status(200).json({
                message: 'Employee updated successfully',
                employee
            });
        } catch (error) {
            console.error('Error during employee update:', error);
            res.status(500).json({
                message: 'Error during employee update',
                error: error.message
            });
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: 'ID is required' });
            if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID' });

            const employee = await userModel.findOneAndDelete(
                {_id: id, role: {$ne: "customer"}},
            );

            if (!employee) return res.status(404).json({ message: 'Employee not found' });

            const avatarPublicId = employee?.avatar?.split("/").pop().split(".")[0];
            if(avatarPublicId) {
                await cloudinary.uploader.destroy(`ecomart/${avatarPublicId}`);
            }

            await Promise.all([
                companyModel.updateMany(
                    { employees: id },
                    { $pull: { employees: id } }
                ),
                shopModel.updateMany(
                    { employees: id },
                    { $pull: { employees: id } }
                )
            ]);

            console.log('Employee deleted successfully', employee);
            res.status(200).json({
                message: 'Employee deleted successfully',
            });
        } catch (error) {
            console.error('Error during employee deletion:', error);
            res.status(500).json({
                message: 'Error during employee deletion',
                error: error.message
            })
        }
    },
    getAll: async (req, res) => {
        try {
            const employees = await userModel.find({role: {$ne: 'customer'}});
            console.log('Employees fetched successfully', employees);
            res.status(200).json({
                message: 'Employees fetched successfully',
                employees
            });
        } catch (error) {
            console.error('Error during fetching employees:', error);
            res.status(500).json({
                message: 'Error during fetching employees',
                error: error.message
            });
        }
    },
    findById: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: 'ID is required' });
            if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID' });

            const employee = await userModel.findOne({_id: id, role: {$ne: 'customer'}});
            if (!employee) return res.status(404).json({ message: 'Employee not found' });

            console.log('Employee fetched successfully', employee);
            res.status(200).json({
                message: 'Employee fetched successfully',
                employee
            });
        } catch (error) {
            console.error('Error during employee fetch:', error);
            res.status(500).json({
                message: 'Error during employee fetch',
                error: error.message
            });
        }
    },
    findByProviderId: async (req, res) => {
        try{
            const { id } = req.params;
            if(!id) return res.status(400).json({ message: 'Provider ID is required' });
            if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID' });

            let provider = await companyModel.findById(id)
                .populate('employees')
                .exec();

            if (!provider) {
                provider = await shopModel.findById(id)
                .populate('employees')
                .exec();
            }

            if (provider) {
                console.log("Employees fetched successfully");
                res.status(200).json({
                    message: 'Employees fetched successfully',
                    employees: provider.employees
                });
            } else {
                return res.status(404).json({
                    message: 'Company or Shop not found'
                });
            }

        } catch(error) {
            console.error('Error during fetching employees by provider ID:', error);
            res.status(500).json({
                message: 'Error during fetching employees by provider ID',
                error: error.message
            });
        }
    },
}


module.exports = employeeController;