const cloudinaryRouter = require('express').Router();
const cloudinaryController = require('../../controllers/cloudinary/controller');
const AuthCheck = require('../../middlewares/AuthCheck');

const rolesAllowedForCloudinaryManagement = [
    "admin", 
    "administrator", 
    "moderator", 
    "supervisor", 
    "shop-admin",
    "shop-administrator", 
    "shop-moderator", 
    "shop-supervisor"
]

cloudinaryRouter.post('/delete-image', AuthCheck(rolesAllowedForCloudinaryManagement), cloudinaryController.delete);


module.exports = cloudinaryRouter;