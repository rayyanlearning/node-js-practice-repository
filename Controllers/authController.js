const User = require('./../models/UserModel');
const catchAsync = require('./../utils/catchAsync');


exports.signup = catchAsync(async(req,res,next)=>{
    const newUser = await User.create(req.body);
    res.status(201).json({
        message:'success',
        data:{
            user:newUser
        }
    })

});