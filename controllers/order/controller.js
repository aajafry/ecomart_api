const orderModel= require('../../models/order/model'),
    productModel= require('../../models/product/model'),
    shopModel= require('../../models/shop/model'),
    companyModel = require('../../models/company/model'),
    userModel= require('../../models/user/model'),
    couponModel = require('../../models/coupon/model');
const { Types } = require('mongoose');

const updateProductQuantity = require('../../utilities/updateProductQuantity')
const validateCoupon = require('../../utilities/validateCoupon')
const calculateDiscount = require('../../utilities/calculateDiscount')
const categorizeItemsBySeller = require('../../utilities/categorizeItemsBySeller')
const updateBalance = require('../../utilities/updateBalance')

const companyId = process.env.COMPANY_ID;

const companyEmployeeRole = [
    "admin", 
    "administrator", 
    "moderator", 
    "supervisor"
];
const shopEmployeeRole = [
    "shop-admin",
    "shop-administrator", 
    "shop-moderator", 
    "shop-supervisor",
];
const customerRole = ['customer'];


const orderController = {
    create: async (req, res) => {
        try {
            const {
                customer : customerData,
                carts,
                shippingAddress,
                payment,
                couponCode,     // Coupon code for discount
                shippingCost,  // Total shipping cost
            } = req.body;

            // Validate customer
            const customer = await userModel.findById(customerData.id)
            if (!customer) return res.status(404).json({ 
                message: "customer not found!" 
            });

            // Fetch products and categorize items by seller
            let itemsWithShop, itemsWithoutShop;
            try {
                ({ itemsWithShop, itemsWithoutShop } = await categorizeItemsBySeller(carts))
            } catch (error) {
                return res.status(404).json({ message: error.message });
            }

            // Validate coupon code if provided
            let coupon = null;
            try {
                coupon = await validateCoupon(couponCode);
            } catch (error) {
                return res.status(400).json({ message: error.message });
            }
            
            // Calculate the shipping cost per seller
            const numberOfSellers = itemsWithShop.size + (itemsWithoutShop.length ? 1 : 0); // Include items without shop
            const shippingCostPerSeller = numberOfSellers > 0 ? Number(shippingCost) / numberOfSellers : 0;
            
            // Function to create order with calculated totals and applied coupon discount
            const processItems = async (items, sellerId) => {
                const subTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
                let couponDiscount = calculateDiscount(items, coupon);
                const effectiveDiscount = Math.min(couponDiscount, subTotal);
                const finalTotal = subTotal - effectiveDiscount + shippingCostPerSeller;

                const order = new orderModel({
                    customer,
                    carts: items,
                    shippingAddress,
                    payment,
                    subTotal,
                    shippingCost: shippingCostPerSeller,
                    discount: effectiveDiscount,
                    finalTotal,
                    seller: sellerId,
                });

                const savedOrder = await order.save();
                return savedOrder;
            }

            // Initialize variables for all orders
            const orders = [];
            
            // Create orders for each shop
            for (let [shop, items] of itemsWithShop) {
                const savedOrder = await processItems(items, shop);
                await shopModel.updateOne({ _id: shop }, {
                    $inc: { balance: savedOrder.finalTotal },
                    $push: { orders: savedOrder._id }
                }, { new: true });
                orders.push(savedOrder);
            }


             // Create order for items without a shop
            if(itemsWithoutShop.length > 0) {
                const savedOrder = await processItems(itemsWithoutShop, companyId);
                await companyModel.updateOne({ _id: companyId }, {
                    $inc: { balance: savedOrder.finalTotal },
                }, { new: true });
                orders.push(savedOrder);
            }

            // stock management
            if (orders.length > 0) {
                await Promise.all(
                    orders.flatMap(order => 
                        order.carts.map(async (item) => {
                            await updateProductQuantity(item._id, item.quantity, false);
                        })
                    )
                );
            }

            // Update customer's and company's order histories
            await Promise.all([
                userModel.updateOne({
                    _id: customer.id
                }, {
                    $push: { orders: {
                        $each: orders.map(order => order._id) 
                    } }
                }),
                companyModel.updateOne({
                    _id: companyId
                }, {
                    $push: { orders: { 
                        $each: orders.map(order => order._id) 
                    } }
                })
            ]);

            res.status(201).json({
                message: "order created successfully",
                orders
            });
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({
                message: "Server error during order creation",
                error: error.message
            });
        }
    },
    getAll: async (req, res) => {
        try {
            const {id, role, shopId} = req.user;
            
            const validatedViewer = await userModel.findById(id);

            if(!validatedViewer) return res.status(404).json({ 
                message: "Viewer not found!" 
            });

            if(companyEmployeeRole.includes(role)) {
                const orders = await orderModel.find({})
                res.status(200).json({
                    message: "successfully retrieved orders",
                    orders
                })
            }

            else if(shopEmployeeRole.includes(role)) {
                const shop = await shopModel.findById(shopId);
                if (!shop) return res.status(404).json({
                    message: "shop not found",
                });

                const orders = await orderModel.find({ "seller": shop._id })

                res.status(200).json({
                    message: "successfully retrieved orders",
                    orders
                });
            }

            else if(customerRole.includes(role)) {
                const orders = await orderModel.find({"customer._id": validatedViewer._id})

                res.status(200).json({
                    message: "successfully retrieved orders",
                    orders
                })
            }
            else {
                return res.status(403).json({
                    message: "access denied!"
                });
            }
            
        } catch (error) {
            console.error('Error during fetching orders:', error);
            res.status(500).json({
                message: 'Error during fetching orders',
                error: error.message
            });
        }
    },
    trackingById: async (req, res) => {
        try {
            const { id: orderId  } = req.params;
            const {id: viewerId} = req.user;
            
            const validatedViewer = await userModel.findById(viewerId);

            if(validatedViewer) {
                const order = await orderModel.findById(orderId)
                res.status(200).json({
                    message: "successfully retrieved order",
                    order
                })
            }
            else {
                return res.status(403).json({
                    message: "access denied!"
                });
            }
        } catch (error) {
            console.error('Error during fetching order:', error);
            res.status(500).json({
                message: 'Error during fetching order',
                error: error.message
            });
        }
    },
    updateStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!id) return res.status(400).json({ 
                message: 'ID is required' 
            });
            if (!Types.ObjectId.isValid(id)) return res.status(400).json({ 
                message: 'Invalid ID' 
            });

            let order = await orderModel.findOneAndUpdate(
                {_id: id},
                {$set: {
                    status: status,
                }},
                { new: true }
            );

            if(!order) return res.status(404).json({
                message: "Order not found!"
            })

            if (order && order.status === "delivered") {
                order = await orderModel.findOneAndUpdate(
                    { _id: order._id }, 
                    { $set: {
                        payment: { status: "paid" },
                        deliveredAt: Date.now(),
                    }}, 
                    { new: true }
                );
            }  

            res.status(200).json({
                message: "successfully updated order",
                order
            })
        } catch (error) {
            console.error('Error during order update:', error);
            res.status(500).json({
                message: 'Error during order update',
                error: error.message
            });
        }
    },
    applyRefund: async (req, res) => {
        try {
            const { id } = req.params;
            const { refundReason } = req.body;

            if (!id) return res.status(400).json({ 
                message: 'ID is required' 
            });
            if (!Types.ObjectId.isValid(id)) return res.status(400).json({ 
                message: 'Invalid ID' 
            });

            const order = await orderModel.findOneAndUpdate(
                {_id: id},
                {$set: {
                    refund: {
                        reason: refundReason
                    },
                }},
                { new: true }
            );

            if(!order) return res.status(404).json({
                message: "Order not found!"
            })

            res.status(200).json({
                message: "Successfully applied refund to order",
                order
            })
        } catch (error) {
           console.error('Error during applying refund to order:', error);
            res.status(500).json({
                message: 'Error during applying refund to order',
                error: error.message
            }); 
        }
    },
    acceptRefund: async (req, res) => {
        try {
            const { id } = req.params;
            const { refundTxID, refundMethod, refundAmount } = req.body;

            if (!id) return res.status(400).json({ 
                message: 'ID is required' 
            });
            if (!Types.ObjectId.isValid(id)) return res.status(400).json({ 
                message: 'Invalid ID' 
            });

            const order = await orderModel.findById(id);

            if(!order) return res.status(404).json({
                message: "Order not found!"
            })

            if (!order.refund) {
                order.refund = {};
            }

            const updatedRefund = {
                ...order.refund,
                id: refundTxID || order.refund.id, 
                amount: refundAmount || order.refund.amount,
                method: refundMethod || order.refund.method 
            };

            order.status = "refunded";
            order.payment.status = "refunded";
            order.refund = updatedRefund;
            

            const populatedOrder = await order.save();

            if (populatedOrder && populatedOrder.status === "refunded") {
                // update shop's sales and inventory
                await Promise.all(  
                    order.carts.map(async (item) => {
                        await updateProductQuantity(item._id, item.quantity, true)
                    })
                )
            }

            // update seller account balance
            await Promise.all([
                updateBalance(shopModel, populatedOrder.seller, refundAmount),
                updateBalance(companyModel, populatedOrder.seller, refundAmount)
            ])

            res.status(200).json({
                message: "Successfully accepting refund order",
                order: populatedOrder
            })
            
        } catch (error) {
            console.error('Error during accepting refund order:', error);
            res.status(500).json({
                message: 'Error during accepting refund order',
                error: error.message
            }); 
        }
    },
    canceledOrder: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) return res.status(400).json({ 
                message: 'ID is required' 
            });
            if (!Types.ObjectId.isValid(id)) return res.status(400).json({ 
                message: 'Invalid ID' 
            });

            const order = await orderModel.findOneAndUpdate(
                {_id: id},
                {$set: {
                    status: "canceled",
                }},
                { new: true }
            );

            if(!order) return res.status(404).json({
                message: "Order not found!"
            })

            if (order && order.status === "canceled") {
                // update shop's sales and inventory
                await Promise.all(  
                    order.carts.map(async (item) => {
                        await updateProductQuantity(item._id, item.quantity, true)
                    })
                )
            }

            res.status(200).json({
                message: "Successfully canceled the order",
                order
            })
        } catch (error) {
           console.error('Error during canceling the order:', error);
            res.status(500).json({
                message: 'Error during canceling the order',
                error: error.message
            }); 
        }
    },
}

module.exports = orderController;