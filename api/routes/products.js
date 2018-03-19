const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const checkAuth = require('../middleware/check-auth');
const bodyParser = require('body-parser');

const storage = multer.diskStorage({
    destination:'./uploads/',

    filename: function(req, file, cb){
     cb(null,file.fieldname + '-' + Date.now() +  path.extname(file.originalname)); 
    }
});

const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
      cb(null, true);
    }else{
    cb(null, false);
    }
};
const upload = multer({ storage: storage,
    limits:{
        fileSize: 1024 * 1024 *5
    },
    fileFilter: fileFilter
    
});

const Product = require('../models/product');

router.get('/', (req, res, next)=>{
    Product.find()
    .select('name price _id productImage description')
    .exec()
    .then(docs =>{
        const response = {
            count: docs.length,
            products: docs.map(doc =>{
                return{
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    description: doc.description,
                    _id: doc._id,
                    rayon: doc.rayon,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }
            })
        }
        console.log(docs);
       //if (docs.length >= 0){
        res.status(200).json(response);
     //  }else{
     //      res.status(404).json({
      //         message: 'NO entries found'
      //     });
      // }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

router.post('/', upload.single('productImage'), (req, res, next) => {
    console.log(req.body);
   // console.log(req.files);
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        rayon: req.body.rayon,
       // magasin: req.body.magasin,
        productImage: req.file.path,
        description: req.body.description,
    });
    product
    .save()
    .then(result => {
        //console.log(result);
        res.status(201).json({
            message: 'Created product successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                productImage: result.productImage,
                rayon: result.rayon,
               // magasin: result.magasin,
               description: result.description,
                request: {
                    type: 'GET',
                    url: "http://localhost:3000/products/" + result._id
                }
            }
    });
 })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
   
    });
    
});

/*router.get('/:productId', (req, res, next)=>{
    const id = req.params.productId;
    Product
    .findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if (doc) {
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    description: 'Get all products',
                    url: 'http://localhost:3000/products'
                }
            });
        }else{
            res.status(404).json({message: 'No valid entry found for provided ID'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});*/

//debut
  router.get('/:param', (req, res, next)=>{
     const param = req.params.param;
     Product
    .find({'rayon': param})
    .select('name price  productImage _id description')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc =>{
                return{
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    description: doc.description,
                    rayon: doc.rayon,
                   _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }
            })
        }
        console.log("From database");
        
            res.status(200).json(response);
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    }); 
});

//fin

router.patch('/:productId', (req, res, next)=>{
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, {$set: updateOps})
    .exec()
    .then(result =>{
        res.status(200).json({
            message: 'produit mise a jour',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' +id
            }
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(400).json({
            error: err 
        });
    });
});

router.delete('/:productId', (req, res, next)=>{
    const id = req.params.productId;
    Product.remove({_id: id})
    .exec()
    .then(result =>{
        res.status(200).json({
            message: 'articles supprimé avec succés',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products',
                body: {name: 'String', price: 'Number'}
            }
        })
    })
    .catch(err =>{
        console.log(err);
        res.status(200).json({

            error: err
        });
    });
});





module.exports = router;


