const mongoose = require('mongoose');

let Schema = new mongoose.Schema({
    from:{type:mongoose.Types.ObjectId,ref:'User'},
    to:{type:mongoose.Types.ObjectId,ref:'User'},
    text:String
},{updatedAt:false});

module.exports = mongoose.model('Message',Schema);