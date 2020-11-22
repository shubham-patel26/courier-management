const express=require('express');
const mysql = require('mysql');
const config = require('../config.js');

const db= mysql.createConnection({
    host: config.host,
    user: config.user,
    password:config.password,
    database:config.database

});

module.exports = db;