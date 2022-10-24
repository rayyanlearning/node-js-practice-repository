const mongoose = require('mongoose');


const userSchema  = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required']
    },
    email:{
        type:String,
        required:[true,'email is required']
    },
    password:{
        type:String,
        required:[true,'password is required']
    },
    passwordConfirm:{
        type:String,
        required:[true,'passwordConfirm is required']
    }
});

const User = mongoose.model('User',userSchema);
module.exports = User;
