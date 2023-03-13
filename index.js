var express = require('express');
var app = express();

const port = process.env.PORT || 3000;

app.get("/", function(req,res){
    res.send("Home !!!")
    }
);

app.get("/toto", function(req,res){
    res.send("salut toto")
    }
);

app.listen(port, function(){
    console.log('serveur listening on port : '+port);
    }
);