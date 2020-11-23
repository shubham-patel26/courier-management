var express = require('express');
var router = express.Router();
var bodyParser=require('body-parser');
var bCrypt = require('bcrypt');
var db=require('../Database/pool');

var authenticate = require('../authenticate');

router.use(bodyParser.json());


/* GET users listing. */
router.get('/',authenticate.verifyUser,(req,res,next)=>{
    console.log(req.user);
    var sql = `SELECT * from users`;

    db.query(sql,[])
    .then(users=> {
         res.statusCode=200;
         res.contentType('Content-Type', 'application/json');
         res.json(users);
    })
    .catch(err=>next(err));
})
//Middleware

router.post('/signup',(req,res,next)=>{
    var sql = `SELECT email_id from users where email_id ='${req.body.email_id}'`;

    var generateHash = function(password) {
          return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
     }
    db.query(sql,[])
    .then(result=>{
         console.log('here');
         if(result.length)
         {
              res.statusCode=400;
              res.setHeader('Content-Type', 'application/json');
              res.json({status: false, message: 'this email_id already exist in the data base'});
         }
         else
         {
               
               let pass = generateHash(req.body.password);
                var newUserMysql = {
                    email_id: req.body.email_id,
                    password : pass,  // use the generateHash function in our user model
                    name: req.body.name,
                };

                var insertQuery = "INSERT INTO users ( email_id, password,name ) values (?,?,?)";
            
                db.query(insertQuery,[newUserMysql.email_id, newUserMysql.password,newUserMysql.name])
                .then(user=>{
                     res.statusCode= 200;
                     res.setHeader('Content-Type','application/json');
                     res.json({status: 'success', message: 'you have been registered successfully'});
                })
                .catch(err=>next(err));
         }
    })
    .catch(err=>next(err));
}

) ;

router.post('/login', (req, res,next) => {
//   console.log(req.body);

     var sql = `SELECT * from users WHERE email_id= '${req.body.email_id}'`;
     
     db.query(sql,[])
     .then(user=>{
          
          if(!user[0]){
               res.statusCode=404;
               res.setHeader('Content-Type', 'application/json');
               res.json({message: 'either email or password is wrong'});
          }
          else{
               async function comparePassword(password,hash){
                    // console.log(password);
                    // console.log(hash);
                    let result= await bCrypt.compare(password,hash );
                    console.log(result);
                    
                    if(result==false){
                         res.statusCode=404;
                         res.setHeader('Content-Type', 'application/json');
                         res.json(' password is wrong');
                    }
                    else{
                         var token = authenticate.getToken({email_id : req.body.email_id});
                         console.log(token);
                         res.statusCode = 200;
                         res.setHeader('Content-Type', 'application/json');
                         res.json({success: true, token: token, status: 'You are successfully logged in!'});
                    }
               }
               comparePassword(req.body.password,user[0].password);
               
               
          }
     })
     .catch(err=>next(err));
     
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


