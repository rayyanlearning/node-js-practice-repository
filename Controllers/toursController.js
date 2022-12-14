const express = require('express');
const mongoose = require('mongoose');
const tourModel = require('./../models/tourModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const ApiFeatures = require('./../utils/apiFeatures');


exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
  };
  
exports.createTour = catchAsync(async(req,res)=>{
    console.log('tours is created');
    const createdTour = await tourModel.create(req.body);
    res.status(200).json({
        body:"hello world api",
        data:createdTour
    });

});

exports.updateTour = catchAsync(async(req,res,next)=>{
const  tour = await tourModel.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true
});
if(!tour){
    next(new AppError('record not found',404));
}
res.status(200).json({
    message:'updated document successfully',
    tours:tour
});

});

exports.getTour = catchAsync(async(req,res,next)=>{
    const tour = await tourModel.findById(req.params.id);
    if(!tour){
        next(new AppError('record not found',404));
    }
    res.status(200).json({
        tours:tour
    });
});

exports.getAllTours = catchAsync(async(req,res,next)=>{
    // const  features = new ApiFeatures(tourModel.find(),req.query).filter();
    const tours = await tourModel.find();
    res.status(200).json({
        allTours:tours
    });
});

exports.deleteTour = catchAsync(async(req,res,next)=>{
    const tour = await tourModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
        message:'deleted successfully',
        tour:null
    });
});


exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgPrice: 1 }
      }
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);
  
    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  });
  
  exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1; // 2021
  
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numTourStarts: -1 }
      },
      {
        $limit: 12
      }
    ]);
  
    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    });
  });
