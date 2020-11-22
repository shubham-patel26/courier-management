const http=require('http');
const express=require('express');
const mysql=require('mysql');
const app=express();
const morgan= require('morgan');
const bodyParser=require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var passport=require('passport');
var path = require('path');
var cors = require('cors');
const db=require('./Database/db');

var authenticate=require('./authenticate');
var usersRouter= require('./Routes/users');
const hostname='localhost';
const port=3444;

var config=require('./config');

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(flash());


db.connect((err,result)=>{
    if(err)
        throw(err);
    else
    console.log('database connected succesfully');
})

require('./passport')(passport);
app.use(session({ secret: 'godaddy420' }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/users', usersRouter);
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
 