require('dotenv').config();

const express = require('express'),
    cors = require('cors');

const connectDB = require('./utilities/database');

const companyRouter = require('./routes/company/route'),
    shopRouter = require('./routes/shop/route'),
    employeeRouter = require('./routes/employee/route'),
    customerRouter = require('./routes/customer/route'),
    categoryRouter = require('./routes/category/route'),
    productRouter = require('./routes/product/route'),
    couponRouter = require('./routes/coupon/route'),
    orderRouter = require('./routes/order/route'),
    cloudinaryRouter = require('./routes/cloudinary/route');

const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

connectDB();

app.get('/', (req, res) => {
    res.status(200).send("wellcome to ecomart endpoint")
})

app.use('/api/company', companyRouter) 
app.use('/api/shop', shopRouter) 
app.use('/api/employee', employeeRouter) 
app.use('/api/customer', customerRouter) 
app.use('/api/category', categoryRouter) 
app.use('/api/product', productRouter) 
app.use('/api/coupon', couponRouter) 
app.use('/api/order', orderRouter)
app.use('/api/cloudinary', cloudinaryRouter) 


app.listen(port, () => {
    console.log(`ecomart-server listening on port no:${port}`)
})