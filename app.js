
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const validator = require('express-validator');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');
const jwt = require('jsonwebtoken');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');
const panierRoutes = require('./api/routes/paniers');
const imageRoutes = require('./api/routes/images');




mongoose.connect('mongodb://localhost:27017/projet');
mongoose.Promise = global.Promise;
require('./config/passport');

app.use(morgan('dev'));

//app.use(bodyParser.urlencoded({extended: false}));
//app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors());
app.use(session({secret: 'mballasecret',
 resave: false, 
saveUninitialized: false,
store: new MongoStore({mongooseConnection: mongoose.connection}),
cookie: {maxAge: 180 * 60 * 1000}
})); 
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('dist'));
app.use('/uploads', express.static('uploads'));
app.use(function(req, res, next){
    res.locals.session = req.session
    console.log(res.locals.session);
   
    next();
});

app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS'){
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET,OPTIONS')
      return res.status(202).json({});
  }
  next();
});

//Routes which should handle requests

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);
app.use('/paniers', panierRoutes);
app.use('/images', imageRoutes);
app.use('*', (req, res) =>{
    res.sendFile(__dirname + '/dist/index.html');
});



app.use((req, res, next) => {
    const error = new Error('Not found ');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;