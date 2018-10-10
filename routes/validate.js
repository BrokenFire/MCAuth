var express = require('express');
var router = express.Router();
const database = require('../database');



router.post('/', (req, res) =>{
    if(req.body.accessToken === "" || req.body.accessToken == null){
        res.status(403).setHeader('Content-Type', 'application/json');
        res.send("{\"error\": \"ForbiddenOperationException\",\"errorMessage\": \"Invalid token.\"}");
    }
    else{
        let q = "SELECT * FROM users WHERE access_token=\"" + req.body.accessToken +"\"";
        database.connection.query(q, function(err, rows, fields) {
            if(rows.length === 0){
                res.status(403).setHeader('Content-Type', 'application/json');
                res.send("{\"error\": \"ForbiddenOperationException\",\"errorMessage\": \"Invalid token.\"}");
            }
            else{
                res.status(204).send();
            }
        });
    }
});


module.exports = router;