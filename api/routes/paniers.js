
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Nexmo = require('nexmo');
var nexmo = new Nexmo({
    apiKey: 'cb2ca9ec',
    apiSecret: 'bc096f405af421b0',
    
  }, {debug: true});
const User = require('../models/user');
const Product = require('../models/product');
const Image = require('../models/image');
const Commandes = require('../models/commande');
const Cart = require('../models/card');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const cartValidator = require('../middleware/cartValidator');


router.get('/', (req, res, next) =>{
    if(!req.session.cart){
        return res.status(404).json({
            message: 'produit introuvable dans le panier'
        });
    }
    var cart = new Cart(req.session.cart);
    res.status(200).json({
       session: res.locals.session.cart.totalQty

    })
});

router.get('/ajouter/:id', (req, res, next) =>{
    
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    Product
    .findById( productId = req.params.id)
    .exec()
    .then(product =>{
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);

        if(!req.session.cart){
            res.status(404).json({products: null});
        }
        
        res.status(200).json({
          
           products: cart.generateArray(),
            totalPrice: cart.totalPrice,
            totalQty: cart.totalQty,
        })
    
    })
    
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
}); 

router.get('/img', checkAuth, (req, res, next) =>{
    if(!checkAuth.cart){
        return res.status(404).json({
            message: 'produit introuvable dans le panier'
        });
    }
    var cart = new Cart(checkAuth.cart);
    res.status(200).json({
       session: checkAuth.cart.totalQty

    })
});

router.post('/ajouter/img/',cartValidator, (req, res, next) =>{
//checkAuth,

if(req.body.cart){
const decoded = jwt.verify(req.body.cart, 'ericomballus');
//console.log(decoded);
const d = new Date();
heure = d.toLocaleTimeString();
console.log(heure);
console.log(decoded.cart);
const panier = decoded.cart;
var cart = new Cart(cartValidator.cart = panier );

    Image
    .findById( productId = req.body.id)
    .exec()
    .then(image =>{
        cart.add(image, image.id);
        cartValidator.cart = cart;

        const newCart = jwt.sign(
            {
            cart: cart,
            products: cart.generateArray(),
            totalPrice: cart.totalPrice,
            totalQty: cart.totalQty,
              },
              'ericomballus',
              {
                  expiresIn: "2h"
              });
       // const decoded = jwt.verify(newCart, process.env.JWT_KEY);
       // console.log(decoded);
        res.status(200).json({
            newCart: newCart,
         })
    })
  
    
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
}
else{
    var cart = new Cart( cartValidator.cart = {});
      console.log ( req.body.id );
      Image
      .findById( productId = req.body.id)
      .exec()
      .then(image =>{
          cart.add(image, image.id);
          cartValidator.cart = cart;
  
          const newCart = jwt.sign(
              { 
             cart: cart,
              products: cart.generateArray(),
              totalPrice: cart.totalPrice,
              totalQty: cart.totalQty,
                },
                'ericomballus',
                {
                    expiresIn: "2h"
                });
          res.status(200).json({
              newCart: newCart,
           })
      }) 
  
    }
}); 


router.post('/reduire/img/',cartValidator, (req, res, next) =>{
const decoded = jwt.verify(req.body.cart, 'ericomballus');
console.log(decoded.cart);
//console.log(req.body.id);
var productId = req.body.id;

var cart = new Cart(cartValidator.cart ? cartValidator.cart : {});

//var cart = new Cart(decoded);

console.log(cart);
cart.reduceByOne(productId);
cartValidator.cart = cart;


const newCart = jwt.sign(
    {
    cart: cart,
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
    totalQty: cart.totalQty,
      },
      'ericomballus',
     // process.env.JWT_KEY,
      {
          expiresIn: "2h"
      });
    
    res.status(200).json({
        newCart: newCart
    });
   // res.redirect('/img');
    })

    router.post('/supprimer/img/', cartValidator, (req, res, next) =>{
        var productId = req.body.id;
        const decoded = jwt.verify(req.body.cart, 'ericomballus');
        
        var cart = new Cart(cartValidator.cart ? cartValidator.cart : {});
        console.log(decoded);
        cart.removeItem(productId);
        cartValidator.cart = cart;
        const newCart = jwt.sign(
            {
            cart: cart,
            products: cart.generateArray(),
            totalPrice: cart.totalPrice,
            totalQty: cart.totalQty,
              },
              'ericomballus',
              {
                  expiresIn: "2h"
              });
       
        res.status(200).json({
            newCart: newCart,
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });  
 })
        

     

        router.post('/valider/img', cartValidator, (req, res, next) =>{
          // console.log(req.body);  checkAuth
            const decoded = jwt.verify(req.body.cart, 'ericomballus');
          //  console.log(decoded);

            if(!cartValidator.cart){
                return res.status(404).json({
                    message: 'produit introuvable dans le panier'
                });
            }
            var cart = new Cart(cartValidator.cart = decoded);
            res.status(200).json({total: cart.totalPrice})
        })

        
            router.post('/commande/img',  cartValidator, (req, res, next) => {
//checkAuth,
                const decodedcommande = jwt.verify(req.body.cart, 'ericomballus');
               // const decoded = jwt.verify(req.body.token, process.env.JWT_KEY);
               // console.log(decoded);
                console.log(decodedcommande);

            if(!cartValidator.cart){
                return res.status(404).json({
                    message: 'produit introuvable dans le panier'
                });
            }
           
            var cart = new Cart(cartValidator.cart = decodedcommande);
            const text = 'nouvelle commande de' + cart ;
              const number = req.body.number;
             
              //code nexmo pour les sms ici 

                const commandes = new Commandes({
                    _id: mongoose.Types.ObjectId(),
                    name: req.body.name,
                    phone: req.body.number,
                    cart: cart,
                    date: Date.now(),
                    
                });
                commandes
                .save()
                .then( resu =>{
                 cartValidator.cart = null
                   // console.log(resu.name);
                    res.status(201).json({
                        message: 'Commande sauvegarder avec succés',
                        createdCommande:{
                            name: resu.name,
                            phone: resu.phone, 
                        }
                   })
               })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });  
 
        });

  


router.get('/reduire/:id', (req, res, next) =>{
var productId = req.params.id;
var cart = new Cart(req.session.cart ? req.session.cart : {});
cart.reduceByOne(productId);
req.session.cart = cart;

res.status(200).json({
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
    totalQty: cart.totalQty,
});
})

router.get('/supprimer/:id', (req, res, next) =>{
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.removeItem(productId);
    req.session.cart = cart;
    
    res.status(200).json({
        products: cart.generateArray(),
        totalPrice: cart.totalPrice,
        totalQty: cart.totalQty,
    });
    })

router.get('/valider', (req, res, next) =>{
    if(!req.session.cart){
        return res.status(404).json({
            message: 'produit introuvable dans le panier'
        });
    }
    var cart = new Cart(req.session.cart);
    res.status(200).json({total: cart.totalPrice})
})

router.post('/commande', (req, res, next) => {
    if(!req.session.cart){
        return res.status(404).json({
            message: 'produit introuvable dans le panier'
        });
    }
    var cart = new Cart(req.session.cart);
    const text = 'nouvelle commande de' + cart ;
      const number = req.body.number;
      nexmo.message.sendSms(
          '237691087025', number, text, {type: 'unicode'},
          (err, responseData) => {
              if(err){
                  console.log(err)
              }else {
                  console.log('bonjour');
              }
          }
      )
  
        const commandes = new Commandes({
            _id: mongoose.Types.ObjectId(),
            name: req.body.name1,
            phone: req.body.number,
            cart: cart,
            date: Date.now(),
            
        });
        commandes
        .save()
        .then( resu =>{
            req.session.cart = null
            console.log(resu);
            res.status(201).json({
                message: 'Commande sauvegarder avec succés',
                createdCommande:{
                    name: resu.name,
                    phone: resu.phone, 
                }
           })
       })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });  
});

router.get('/commande', (req, res, next)=>{
    Commandes.find( function(err, docs){
        if (err){
            res.status(500).json({ error: err});
        }
        var cart;
       // var productId = req.params.id;
        docs.forEach(function(doc){
            cart = new Cart(doc.cart);
            doc.cart.items = cart.generateArray();
        });
        res.status(200).json({
            docs: docs,
        })
    })
    
    .catch(err =>{
        res.status(500).json({
            errorcommmande: err 
        });
    });
});
router.delete('/:orderId', (req, res, next)=>{
    Order
    .remove({_id: req.params.orderId})
    .exec()
    .then(result =>{
        res.status(200).json({
           message: 'order Deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders',
                body: {productId: 'ID', quantity: 'Number'}
            }
        });
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
})
 /*function verifyToken(req, res, next){
     const bearerHeader =req.headers.authorization;
     if(typeof bearerHeader !== 'undefined'){

        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
     } else {
         res.sendStatus(403);
     }
 }*/

module.exports = router;