var express = require('express');
var router = express.Router();
var bodyParser=require('body-parser');
var {verifyUser} = require('../authenticate');

router.use(bodyParser.json());

router.use(bodyParser.json());

router.get('/',verifyUser,(req,res,next)=>{
    
})