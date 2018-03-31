const mongoose = require('mongoose');
// Interface for TS
/*var IImageModel extends mongoose.Document {
    filename: string;
    originalName: string;
    desc: string;
    created: Date;
  };

  // Actual DB model
export let imageSchema = new mongoose.Schema({
    filename: String,
    originalName: String,
    desc: String,
    created: { type: Date, default: Date.now }
});

export const Image = mongoose.model<IImageModel>('Image', imageSchema);*/


const imageSchema = mongoose.Schema({
    filename: String,
    originalName: String,
    desc: String,
    magasin: String,
    commentaire: String,
    created: { type: Date, default: Date.now },   
    name: { type: String, required: true },
    rayon: { type: String, required: true },
    price: { type: Number, required: true },
});

module.exports = mongoose.model('Image', imageSchema);