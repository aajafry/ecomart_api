const customerRouter = require('express').Router();
const customerController = require('../../controllers/customer/controller');
const AuthCheck = require('../../middlewares/AuthCheck')

const rolesAllowedToViewAllCostomer = [
    "admin", 
    "administrator", 
    "moderator", 
    "supervisor",
]

customerRouter.post('/signup', customerController.signup);
customerRouter.post('/login', customerController.login);
customerRouter.get('/', AuthCheck(rolesAllowedToViewAllCostomer), customerController.getAll);
customerRouter.get('/:id', customerController.findById);
customerRouter.put('/:id', customerController.update);
customerRouter.delete('/:id', customerController.delete);

module.exports = customerRouter;