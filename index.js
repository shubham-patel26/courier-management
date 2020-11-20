const http=require('http');
const express=require('express');
const mysql=require('mysql');
const app=express();
const morgan= require('morgan');
const bodyParser=require('body-parser');
var passport=require('passport');
var path = require('path');
var cors = require('cors');

var authenticate=require('./authenticate');

const hostname='localhost';
const port=3444;

var config=require('./config');

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());

const db= mysql.createConnection({
    host: config.host,
    user: config.user,
    password:config.password,
    database:config.database

});

db.connect((err,result)=>{
    if(err)
        throw(err);
    else
    console.log('database connected succesfully');
})


app.use(passport.initialize());
app.use(passport.session());
app.use((req,res,next)=>{
    console.log(req.headers);
    res.statusCode=200;
    res.setHeader('Content-Type','text/html');
    res.end('<html><body><h1>This is an express server</h1></body></html>');
});

const server=http.createServer(app);

server.listen(port,hostname,()=>{
    console.log(`Server running at http://${hostname}:${port}`);
});
 