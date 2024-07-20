const mongoose = require('mongoose');
let Schema = new mongoose.Schema({
    userName :{
        type:String,
        required:true,
        unique:true
    },
    email :{
        type:String,
        required:true,
    },
    password :{
        type:String,
        required:true,
    },
    contacts:[{type:mongoose.Types.ObjectId,ref:'User'}],
    blockedByPeople:[{type:mongoose.Types.ObjectId,ref:'User'}],
    blockedPeopleByMe:[{type:mongoose.Types.ObjectId,ref:'User'}],
});

module.exports = mongoose.model('User',Schema);