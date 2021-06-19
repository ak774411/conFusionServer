const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');


const favourite = require('../models/favoriteSchema');

const favouriteRouter = express.Router();

favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus(200);
})
.get(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) =>{
    favourite.findOne({user:req.user._id})
    .populate('dishes._id')
    .populate('user')
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    //console.log(req.body);
    favourite.findOne({user:req.user._id})
    .then((favourites)=>{
        if(favourites==null){
            favourite.create({user:req.user._id})
            .then((favourites)=>{
                for(let i of req.body){
                    favourites.dishes.push({_id:i._id});
                }
                //favourites.dishes.create(req.body);
                favourites.save()
                .then((favourites)=>{
                    console.log('Dish Created');
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favourites);
            
                },(err)=>next(err))
        
            },(err)=>next(err))
        }
        else{
            //console.log(req.body);
            for(let i of req.body){
                favourites.dishes.push({_id:i._id});
            }
            //favourites.dishes.create(req.body);
            favourites.save()
            .then((favourites)=>{
                console.log('Dish Created');
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(favourites);
        
            },(err)=>next(err))
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    favourite.findOne({user:req.user._id})
    .then((favourites)=>{
        if(favourites !=null){
            for(var i = favourites.dishes.length-1;i>=0;i--){
                favourites.dishes.id(favourites.dishes[i]._id).remove();
            }
            favourites.save()
            .then((favourites)=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(favourites.dishes);
            },(err)=>next(err));
        }
        else{
            let err = new Error("favourite not found");
            err.status = 404;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
});

favouriteRouter.route('/:favouriteId')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus(200);
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    favourite.findOne({user:req.user._id})
    .then((favourites)=>{
        if(favourites==null){
            favourite.create({user:req.user._id})
            .then((favourites)=>{
                favourites.dishes.push({_id:req.params.favouriteId});
                favourites.save()
                .then((favourites)=>{
                    console.log('Dish Created',favourites);
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favourites);
            
                },(err)=>next(err))
        
            },(err)=>next(err))
        }
        else{
            favourites.dishes.push({_id:req.params.favouriteId});
            favourites.save()
            .then((favourites)=>{
                console.log('Dish Created',favourites);
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(favourites);
        
            },(err)=>next(err))
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    favourite.findOne({user:req.user._id})
    .then((favourites)=>{
        if(favourites !=null && favourites.dishes.id(req.params.favouriteId)!=null){
            if(favourites !=null && favourites.dishes.id(req.params.favouriteId)!=null){
                favourites.dishes.id(req.params.favouriteId).remove();
                favourites.save()
                .then((favourites)=>{
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json(favourites);
                },(err)=>next(err));
            }else{
                let err = new Error("you can't modify it because you are not the creator");
                err.status = 404;
                return next(err);
            }
        }
        else{
            let err = new Error("favourites" + req.params.favouriteId+ "not found");
            err.status = 404;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
});





module.exports = favouriteRouter;
