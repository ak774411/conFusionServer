const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const leader = require('../models/leaders');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get((req,res,next) =>{
    leader.find({})
    .then((leaders)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post((req,res,next)=>{
    leader.create(req.body)
    .then((leaders)=>{
        console.log('Dish Created',leaders);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);

    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end('Put operation not supported on /leaders');
})
.delete((req,res,next)=>{
    leader.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

leaderRouter.route('/:leaderId')
.get((req,res,next) =>{
    leader.findById(req.params.leaderId)
    .then((leaders)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post((req,res,next)=>{
    res.end('Post operation not supported on /leader/' + req.params.dishId);
})
.put((req,res,next)=>{
    leader.findByIdAndUpdate(req.params.leaderId,{
        $set:req.body
    },{new:true})   
    .then((leaders)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
    },(err)=>next(err))
    .catch((err)=>next(err));

})
.delete((req,res,next)=>{
    leader.findByIdAndRemove(req.params.leaderId)
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});




module.exports = leaderRouter;
