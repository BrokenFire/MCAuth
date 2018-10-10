var express = require('express');
var router = express.Router();
const uuidV4 = require('uuid/v4');
const md5 = require('md5');
const database = require('../database');
const bcrypt = require('bcrypt-nodejs');



router.post('/', (req, res) =>{


    let q = "SELECT * FROM users WHERE user_name=\"" + req.body.username +"\"";
    database.connection.query(q, function(err, rows, fields) {
        if (err) throw err;

        if(req.body.username === "" || req.body.password === "" || req.body.username == null || req.body.password == null){
            res.status(403).setHeader('Content-Type', 'application/json');
            res.send("{\"error\": \"ForbiddenOperationException\",\"errorMessage\": \"Invalid credentials. Invalid username or password.\"}");
        }
        else if(rows.length === 0){
            res.status(403).setHeader('Content-Type', 'application/json');
            res.send("{\"error\": \"ForbiddenOperationException\",\"errorMessage\": \"Invalid credentials. Invalid username or password.\"}");
        }
        else{
            if(bcrypt.compareSync(req.body.password, rows[0].password)){
                let newToken =  md5(uuidV4());
                let row = rows[0];
                let responseObj = {
                    accessToken : newToken,
                    clientToken : row.client_token,
                    selectedProfile : {
                        id : row.user_id,
                        name : row.user_name,
                        userId : row.user_id
                    }
                };
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(responseObj));

                let updateP = "UPDATE `users` SET `access_token` = '" + newToken + "' WHERE `id` = " + row.id;
                database.connection.query(updateP, function(err, rows, fields) {
                    if (err) throw err;
                });

            }
            else{
                res.status(403).setHeader('Content-Type', 'application/json');
                res.send("{\"error\": \"ForbiddenOperationException\",\"errorMessage\": \"Invalid credentials. Invalid username or password.\"}");

            }
            console.log(rows)
        }
    });


});


module.exports = router;