const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
app.use(cors());
app.options('*', cors());


//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(_dirname + '/public/uploads'));
app.use(errorHandler);


//Routers
const categoryRoutes = require('./routers/category');
const productsRoutes = require('./routers/products');
const userRoutes = require('./routers/user');
const orderRoutes = require('./routers/order');

const api = process.env.API_URL;

app.use(`${api}/category`, categoryRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, userRoutes);
app.use(`${api}/order`, orderRoutes);

//Database
mongoose.connect(process.env.CONNECTION_STRING)
.then(() => {
    console.log('Database Connection is ready...')
})
.catch(err => {
    console.log(err);
})

//Server
app.listen(3000, ()=> {

    console.log('Server on');
})