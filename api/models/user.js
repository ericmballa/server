const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    
    password: { type: String, required: true },
    name: {type: String, required: true },
    phone: {type: Number, required: true }
});
userSchema.methods.encryptPassword = function(password){
    return bycrypt.hashSync(password, bycrypt.genSaltSync(5), null);
}
 userSchema.methods.validPassword = function(password){
     return bycrypt.compareSync(password, this.password);
 }
module.exports = mongoose.model('User', userSchema);