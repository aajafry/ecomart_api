const employeeRouter = require('express').Router();
const employeeController = require('../../controllers/employee/controller');
const AuthCheck = require('../../middlewares/AuthCheck');

const rolesAllowedForEmployeeManagement = [
    "admin", 
    "administrator", 
    "moderator", 
    "supervisor", 
    "shop-admin",
    "shop-administrator", 
    "shop-moderator", 
    "shop-supervisor"
]

const rolesAllowedToViewAllEmployees = [
    "admin", 
    "administrator", 
    "moderator", 
    "supervisor", 
]

employeeRouter.post('/create', AuthCheck(rolesAllowedForEmployeeManagement), employeeController.create);
employeeRouter.put('/:id',  AuthCheck(rolesAllowedForEmployeeManagement), employeeController.update);
employeeRouter.delete('/:id', AuthCheck(rolesAllowedForEmployeeManagement), employeeController.delete);
employeeRouter.get('/', AuthCheck(rolesAllowedToViewAllEmployees), employeeController.getAll);
employeeRouter.get('/:id', AuthCheck(rolesAllowedForEmployeeManagement), employeeController.findById);
employeeRouter.get('/provider/:id', AuthCheck(rolesAllowedForEmployeeManagement), employeeController.findByProviderId);

module.exports = employeeRouter;