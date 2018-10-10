var express = require('express');
var router = express.Router();

const uuidV4 = require('uuid/v4');
const md5 = require('md5');
const bcrypt = require('bcrypt');
const database = require('../database');



router.post('/', (req, res) =>{
    if(req.body.clientToken === "" || req.body.clientToken == null){
        res.status(403).setHeader('Content-Type', 'application/json');
        res.send("{\"error\": \"ForbiddenOperationException\",\"errorMessage\": \"Invalid token.\"}");
    }
    else{
        let q = "SELECT * FROM users WHERE client_token=\"" + req.body.clientToken +"\"";
        database.connection.query(q, function(err, rows, fields) {
            if(rows.length === 0){
                res.status(403).setHeader('Content-Type', 'application/json');
                res.send("{\"error\": \"ForbiddenOperationException\",\"errorMessage\": \"Invalid token.\"}");
            }
            else{
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
        });
    }
});


module.exports = router;
