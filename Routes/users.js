var express = require('express');
var router = express.Router();
var bodyParser=require('body-parser');
var LocalStrategy   = require('passport-local').Strategy;
var db=require('../Database/db');
var passport=require('passport');
var authenticate = require('../authenticate');
router.use(bodyParser.json());


/* GET users listing. */
// router.get('/',authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next)=>{
//     // User.find({})
//     // .then(users=>{
//     //   res.statusCode=200;
//     //     res.setHeader('Content-Type','application/json');
//     //     res.json(users);
//     // })
//     // .catch(err=>next(err));
// })
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/dashboard',

    failureRedirect: '/signup'
}

));

router.post('/login', passport.authenticate('local'), (req, res) => {
//   console.log(req.user);
     var token = authenticate.getToken({id: req.user._id});
     console.log(token);
     res.statusCode = 200;
     res.setHeader('Content-Type', 'application/json');
     res.json({success: true, token: token, status: 'You are successfully logged in!'});
});


// router.get('/logout', function(req, res) {
// //   if(req.session)
// //   {
// //     req.session.destroy();
// //     res.clearCookie('session-id');
// //     res.redirect('/');
// //   }
// //   else{
// //     var err=new Error('You are not logged in');
// //     err.status=403;
// //     next(err);
// //   }
  
// });




module.exports = router;


