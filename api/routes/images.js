const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const del = require('del');
const path = require('path');



const Image = require('../models/image');

const router = express.Router();


 let UPLOAD_PATH = 'uploads';

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_PATH)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})
 let upload1 = multer({ storage: storage })


 router.post('/', upload1.single('image'), (req, res, next) => {
    // Create a new image model and fill the properties
    //const d = new Date();
   // heure = d.toLocaleTimeString();
    let newImage = new Image();
    newImage.filename = req.file.filename;
    newImage.originalName = req.file.originalname;
    newImage.desc = req.body.desc;
    newImage.name = req.body.name;
    newImage.rayon = req.body.rayon;
    newImage.price = req.body.price;
    newImage.magasin = req.body.magasin;
    newImage.commentaire = req.body.commentaire;
    
    newImage.save(err => {
        if (err) {
            return res.status(500).json({
                error: err
            });
        }
        res.status(201).json({ newImage });
    });
});

router.get('/imagephone', upload1.single('image'), (req, res, next) => {
    // Create a new image model and fill the properties
    //const d = new Date();
   // heure = d.toLocaleTimeString();
    let newImage = new Image();
    newImage.filename = req.file.filename;
    newImage.originalName = req.file.originalname;
    newImage.desc = req.params.desc;
    newImage.name = req.params.name;
    newImage.rayon = req.params.rayon;
    newImage.price = req.params.price;
    newImage.magasin = req.params.magasin;
    newImage.commentaire = req.params.commentaire;
    
    newImage.save(err => {
        if (err) {
            return res.status(500).json({
                error: err
            });
        }
        res.status(201).json({ newImage });
    });
});

router.get('/', (req, res, next) => {
    // use lean() to get a plain JS object
    // remove the version key from the response
    Image.find({}, '-__v').lean().exec((err, images) => {
        if (err) {
            res.sendStatus(400);
        }

        // Manually set the correct URL to each image
        for (let i = 0; i < images.length; i++) {
            var img = images[i];
            img.url = req.protocol + '://' + req.get('host') + '/images/' + img._id;
        }
        res.json(images);
    })
});

router.get('/retour/:param', (req, res, next) => {
    let param = req.params.param;
    console.log(param);

    Image.find({'rayon': param}, '-__v').lean().exec((err, images) => {
        if (err) {
            res.sendStatus(400);
        }

        // Manually set the correct URL to each image
        for (let i = images.length - 1; i >= 0; i--) {
            var img = images[i];
            img.url = req.protocol + '://' + req.get('host') + '/images/' + img._id;
        }
        res.json(images);
    })
});

router.get('/articles/:name', (req, res, next) => {
    let param = req.params.name;
    console.log(param);

    Image.find({'name': param}, '-__v').lean().exec((err, images) => {
        if (err) {
            res.sendStatus(400);
        }

        // Manually set the correct URL to each image
        for (let i = images.length - 1; i >= 0; i--) {
            var img = images[i];
            img.url = req.protocol + '://' + req.get('host') + '/images/' + img._id;
        }
        res.json(images);
    })
});


router.get('/:id', (req, res, next) => {
    let imgId = req.params.id;

    Image.findById(imgId, (err, image) => {
        if (err) {
            res.sendStatus(400);
        }
        // stream the image back by loading the file
        res.setHeader('Content-Type', 'image/jpeg');
        fs.createReadStream(path.join(UPLOAD_PATH, image.filename)).pipe(res);
    })
});

// Delete one image by its ID
router.delete('/:id', (req, res, next) => {
    let imgId = req.params.id;

    Image.findByIdAndRemove(imgId, (err, image) => {
        if (err && image) {
            res.sendStatus(400);
        }

        del([path.join(UPLOAD_PATH, image.filename)]).then(deleted => {
            res.sendStatus(200);
        })
    })
});

module.exports = router;