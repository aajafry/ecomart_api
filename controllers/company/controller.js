const bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken');
const { Types } = require('mongoose');
const companyModel = require('../../models/company/model'),
    userModel = require('../../models/user/model');
const generateToken = require('../../utilities/generateToken');

const companyController = {
    register: async (req, res) => {
        try {
            const { 
                name, 
                employeeName, 
                employeeEmail, 
                employeePassword, 
                employeeRole 
            } = req.body;

            if (!["admin", "administrator", "moderator", "supervisor"].includes(employeeRole)) {
                return res.status(400).json({
                     message: 'Invalid employee role' 
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(employeePassword, salt);

            const employee = new userModel({
                name: employeeName,
                email: employeeEmail,
                password: hashedPassword,
                role: employeeRole
            })
            await employee.save();

            console.log("successfully registered an employee", employee);

            const company = new companyModel({
                name: name,
                employees: [employee._id]
            });
            await company.save();

            console.log("successfully registered company", company);
            res.status(201).json({
                message: "Company and employee successfully registered",
                company,
                employee
            });
        } catch (error) {
            console.error('error during company registration:', error);
            res.status(500).json({
                message: "server error during company registration",
                error: error.message
            });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const allowedRoles = ["admin", "administrator", "moderator", "supervisor"];

            const employee = await userModel.findOne({ email, role: {$in: allowedRoles } });
            if (!employee) return res.status(401).json({ message: 'Authentication Failed!' });

            const company = await companyModel.findOne({ employees: employee._id })
            if (!company) return res.status(401).json({ message: 'Authentication Failed!' });

            const isValidPassword = await bcrypt.compare(password, employee.password);
            if (!isValidPassword) return res.status(401).json({ message: 'Authentication Failed!!'});

            const payload = {
                id: employee._id,
                name: employee.name,
                email: employee.email,
                role: employee.role,
                avatar: employee.avatar,
                companyId: company._id
            }
            const token = generateToken(payload);

            console.log("Successfully logged in company employee", token);
            res.status(200).json({
                message: 'Successfully logged in company employee',
                token
            });
        } catch (error) {
            console.error('error during logged in company employee:', error);
            res.status(500).json({
                message: "server error during logged in company employee",
                error: error.message
            });
        }
    },
    getAll: async (req, res) => {
        try {
            const companies = await companyModel.find()
                .populate('employees')
                .populate('shops')
                .populate('customers')
                .populate('products')
                .populate('orders')
                .populate('coupons')
                .exec();
            console.log("Successfully retrieved companies:", companies);
            res.status(200).json({
                message: "companies successfully retrieved",
                companies
            });
        } catch (error) {
            console.error('error retrieving companies:', error);
            res.status(500).json({
                message: "server error during retrieval",
                error: error.message
            });
        }
    },
}

module.exports = companyController;