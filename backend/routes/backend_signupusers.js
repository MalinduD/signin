let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let bcrypt = require('bcryptjs');


router.use(bodyParser.urlencoded({
    extended: true
}));

let SignupUsers = require('../models/signupusers');

router.post('/addSignupUsers', async function (req,res) {
    console.log('Signup Users Post Called');
    

    let FName = req.body.fname;
    let LName = req.body.lname;
    let Email = req.body.email;
    let Password = req.body.password;

    let errors = req.validationErrors;

    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(Password, salt)

            if(errors) {
                console.log('errors reported in signup uers post');
            } else {
                SignupUsers.findOne({email:Email}, function (err,signupUser) {
                    if(signupUser) {
                        console.log('User Already Registered.');
                           res.redirect('/Signin');
                    } else {
                        let signupuser = new SignupUsers({
                            fName:FName,
                            lName:LName,
                            email:Email,
                            password:hashedPassword
                            
                        });
                        req.session.signupuser = signupuser._id;  
        
                        signupuser.save(function (err) {
                            if(err) return console.log(err);
                            console.log('Signup User Successfully Added.');
                            console.log(signupuser);
                             res.redirect('/Signin');
                        })
                    }
                })
            }


       



});


module.exports = router;