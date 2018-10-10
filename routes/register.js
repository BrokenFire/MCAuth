var express = require('express');
var router = express.Router();

const uuidV4 = require('uuid/v4');
const md5 = require('md5');
const bcrypt = require('bcrypt');
const database = require('../database');

const saltRounds = 10;


class User {
    constructor(user_name, password, user_id, access_token, client_token){
        this.user_name = user_name;
        this.password = password;
        this.user_id = user_id;
        this.access_token = access_token;
        this.client_token = client_token;
    }

    save(){
        let q = "INSERT INTO `users` (`user_name`, `password`, `user_id`, `access_token`, `client_token`) VALUES ('" + this.user_name + "', '"+this.password + "', '" + this.user_id + "', '" + this.access_token + "', '" + this.client_token+"');";
        database.connection.query(q,  function (err, rows, fields) {
            if ( err ) throw  err;
        })
    }
}





/* GET home page. */
router.get('/', function (req, res, next) {

    res.render('register', {data : {},message: "",errors:  {}});
});

router.post('/', (req, res) =>{
    let response = {
        errors : {}
    };
    let error = false;
    let form = req.body;
    if(!checkUsername(form.user_name)){
        response.errors.user_name = "Something was wrong with your username";
        error = true;
    }
    if ( form.password === "" ){
        response.errors.password = "Please enter a password";
        error = true;

    }
    else if( form.check_password === "" || form.password !== form.check_password){
        response.errors.password = "Please confirm your password";
        error = true;
    }

    if(!error){
        let q = "SELECT * FROM users WHERE user_name=\"" + form.user_name +"\"";
        database.connection.query(q, function(err, rows, fields) {
            if (err) throw err;
            if(rows.length !== 0){
                console.log("User name exist!");
                response.errors.user_name = "User name already exist";
                error = true;
                res.render('register', {
                        message: "",
                        errors: response.errors
                    }
                );

            }else{
                createUser(form.user_name, form.password );
                res.render('register', {
                        message: "Registration successful",
                        errors: response.errors
                    }
                );
            }

        });
    }
    else{
        res.render('index', {
                message: "",
                errors: response.errors
            }
        );
    }




});


function generateToken(){

    return md5(uuidV4());
}


function createUser(username, password){
    let hash = bcrypt.hashSync(password, saltRounds);

    let user = new User(username, hash, generateToken(), generateToken(), generateToken());
    user.save();

}

function checkUsername(username) {
    if(username === ""){
        return false;
    }
    return !username.includes(" ");

}



module.exports = router;




