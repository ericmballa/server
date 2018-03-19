
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Nexmo = require('nexmo');
var nexmo = new Nexmo({
    apiKey: 'cb2ca9ec',
    apiSecret: 'bc096f405af421b0',
    
  }, {debug: true});

const Product = require('../models/product');
const Image = require('../models/image');
const Commandes = require('../models/commande');
const Cart = require('../models/card');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

//handle incoming  Get request to /panier


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

router.get('/ajouter/img/:id', checkAuth,  (req, res, next) =>{
   
    console.log(req.headers)
    var cart = new Cart(checkAuth.cart ? checkAuth.cart : {});
    Image
    .findById( productId = req.params.id)
    .exec()
    .then(image =>{
        cart.add(image, image.id);
        checkAuth.cart = cart;
        

        if(!checkAuth.cart){
            res.status(404).json({products: null});
        }
        
        res.status(200).json({
        
           products: cart.generateArray(),
            totalPrice: cart.totalPrice,
            totalQty: cart.totalQty,
        })
       // res.redirect('/img');
    })
    
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
});


router.get('/reduire/img/:id', checkAuth, (req, res, next) =>{

    var productId = req.params.id;
    var cart = new Cart(checkAuth.cart ? checkAuth.cart : {});
    cart.reduceByOne(productId);
    checkAuth.cart = cart;
    
    res.status(200).json({
        products: cart.generateArray(),
        totalPrice: cart.totalPrice,
        totalQty: cart.totalQty,
    });
   // res.redirect('/img');
    })

    router.get('/supprimer/img/:id', checkAuth, (req, res, next) =>{
        var productId = req.params.id;
        console.log(productId);
        var cart = new Cart(checkAuth.cart ? checkAuth.cart : {});
        cart.removeItem(productId);
        checkAuth.cart = cart;
        
        res.status(200).json({
            products: cart.generateArray(),
            totalPrice: cart.totalPrice,
            totalQty: cart.totalQty,
        });
        })


        router.get('/img', (req, res, next) =>{
            if(!checkAuth.cart){
                return res.status(404).json({
                    message: 'produit introuvable dans le panier'
                });
            }
            var cart = new Cart(checkAuth.cart);
            res.status(200).json({
                products: cart.generateArray(),
                totalPrice: cart.totalPrice,
                totalQty: cart.totalQty,
        
            })
        });

       /* router.get('/valider/img', (req, res, next) =>{
            if(!checkAuth.cart){
                return res.status(404).json({
                    message: 'produit introuvable dans le panier'
                });
            }
            var cart = new Cart(checkAuth.cart);
            res.status(200).json({total: cart.totalPrice})
        })*/

        router.get('/valider/img',checkAuth, (req, res, next) =>{
            if(!checkAuth.cart){
                return res.status(404).json({
                    message: 'produit introuvable dans le panier'
                });
            }
            var cart = new Cart(checkAuth.cart);
            res.status(200).json({total: cart.totalPrice})
        })

        router.post('/commande/img', checkAuth, (req, res, next) => {

            if(!checkAuth.cart){
                return res.status(404).json({
                    message: 'produit introuvable dans le panier'
                });
            }
           
            var cart = new Cart(checkAuth.cart);
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
                    checkAuth.cart = null
                    console.log(resu.name);
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

     router.get('/commande/img', (req, res, next)=>{
            Commandes.find({}).lean().exec((err, docs) =>{
                if (err) {
                    res.sendStatus(400);
                }

                var cart;
                // var productId = req.params.id;
                 docs.forEach(function(doc){
                     cart = new Cart(doc.cart);
                     doc.cart.items = cart.generateArray();
                 });

                res.status(200).json(
                    docs
                );
            })
                
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

module.exports = router;