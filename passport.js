

var mysql = require('mysql');
var bCrypt = require('bcrypt');
var db=require('./Database/db');	

// expose this function to our app using module.exports
module.exports = function(passport) {

	var LocalStrategy   = require('passport-local').Strategy;
    passport.serializeUser(function(user, done) {
		done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
		db.query("select * from users where id = "+id,function(err,rows){	
			done(err, rows[0]);
		});
    });
	

 	

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email_id
        usernameField : 'email_id',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    
    function(req, email_id, password, done) {
        var generateHash = function(password) {
 
            return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);

        };
		
        db.query("select * from users where email_id = '"+email_id+"'",function(err,rows){
			console.log(rows);
			console.log("above row object");
			if (err)
                return done(err);
			 if (rows.length) {
                return done(null, false, req.flash('signupMessage', 'That email_id is already taken.'));
                
            } else {


                password = generateHash(password);// use the generateHash function in our user model
                
                

				var insertQuery = `INSERT INTO users ( email_id, password, name ) values ('${email_id}','${password}','${req.body.name}')`;
					console.log(insertQuery);
				db.query(insertQuery,function(err,rows){
				
				
				return done(null, rows);
				});	
            }	
		});
    }));

   

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email_id
        usernameField : 'email_id',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email_id, password, done) { // callback with email_id and password from our form

         db.query("SELECT * FROM `users` WHERE `email_id` = '" + email_id + "'",function(err,rows){
			if (err)
                return done(err);
			 if (!rows.length) {
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            } 
			
			// if the user is found but the password is wrong
            if (!( rows[0].password == password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
			
            // all is well, return successful user

            return done(null, rows[0]);			
		
		});
		


    }));

};