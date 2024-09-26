const companyRouter = require('express').Router();
const companyController = require('../../controllers/company/controller');
const AuthCheck = require('../../middlewares/AuthCheck')

const rolesAllowedToViewAllCompany = [
    "admin", 
    "administrator", 
    "moderator", 
    "supervisor",
]


companyRouter.post('/register', companyController.register);
companyRouter.post('/login', companyController.login);
companyRouter.get('/', AuthCheck(rolesAllowedToViewAllCompany), companyController.getAll);

module.exports = companyRouter;