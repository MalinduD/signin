require('dotenv').config()

let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');


router.use(bodyParser.urlencoded({
    extended: true
}));


let SignupUsers = require('../models/signupusers');


router.post('/SigninUsers', async function(req, res){

    console.log('Signin Customers Post Called');
    


    let Email = req.body.lemail;
    let Password = req.body.lpassword;
    

    let errors = req.validationErrors;

    SignupUsers.findOne({email:Email}, async function(err, SigninUser){
        console.log(SigninUser);
        if(SigninUser){
            console.log('Customer email is matched');
            
            if(await bcrypt.compare(Password, SigninUser.password)){
                console.log('Customer password is matched');
                const user = {name : Email}

                const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
                console.log(accessToken);
                res.redirect('/Mainpage/'+accessToken);
            }else{
                console.log('Customer password is not matched');
                res.redirect('/Signin');
            }
        }else{
            console.log('Customer not found'); 
            
            res.redirect('/Signin');
        }
    })

});


module.exports = router;