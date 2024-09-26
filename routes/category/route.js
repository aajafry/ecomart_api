const categoryRouter = require('express').Router();
const categoryController = require('../../controllers/category/controller');
const AuthCheck = require('../../middlewares/AuthCheck');

const rolesAllowedForCreation = [
    "admin", 
    "administrator", 
    "moderator", 
    "supervisor", 
    "shop-admin",
    "shop-administrator", 
    "shop-moderator", 
    "shop-supervisor"
]
const rolesAllowedForModification = [
    "admin", 
    "administrator", 
    "moderator", 
    "supervisor",
]

categoryRouter.post('/create', AuthCheck(rolesAllowedForCreation), categoryController.create);
categoryRouter.get('/', categoryController.getAll);
categoryRouter.get('/:id', categoryController.findById);
categoryRouter.put('/:id', AuthCheck(rolesAllowedForModification), categoryController.update);
categoryRouter.delete('/:id', AuthCheck(rolesAllowedForModification), categoryController.delete);

module.exports = categoryRouter;