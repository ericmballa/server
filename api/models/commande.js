const mongoose = require('mongoose');

const commandesSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String },
    phone: {type: Number},
    cart: {type: Object, require: true},
    date: {type: Date},
    /*rayon: {type: String},
    produit: {type: String},
    quantite: {type: String},
    prixtotal: {type: Number}*/
});

module.exports = mongoose.model('Commande', commandesSchema);