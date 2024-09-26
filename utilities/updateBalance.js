const shopModel= require('../models/shop/model'),
    companyModel = require('../models/company/model'),
    userModel= require('../models/user/model');

async function updateBalance(model, id, amount) {
    const entity = await model.findById(id);
    if(entity) {
        entity.balance = Math.max(entity.balance - amount, 0)
        await entity.save();
    }
}




module.exports = updateBalance