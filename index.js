var express = require('express');
var app = express();
/* var favicon = require('serve-favicon');
var path = require('path');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
 */

const port = process.env.PORT || 3000;

var annotations={};
var id=0;
var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.static("static"));

app.get('/',(req,res)=>{
    res.redirect('/formulaire.html');
 }) 

app.post("/Annotation", function(req,res){
    //res.sendfile("D:/Applis/Git/DonneesConnectees/Module.html");
    var body = req.body;
    console.log("body :"+JSON.stringify(body));
    //data.push(body);
    annotations[id]=body;
    console.log("liste annotations :"+JSON.stringify(annotations));
    id++;
    res.send("annotation ajoutée");    
    }
);

// Route pour récupérer une annotation
app.get('/annotations', function(req, res) {
    // Récupération de l'ID et du format de données depuis les paramètres de la requête
    var id = req.query.id;
    var format = req.query.format;
  
    // Récupération de l'annotation correspondant à l'ID dans la liste des annotations
    var annotation = annotations[id];
    console.log("annotation"+annotation)
    // Si l'annotation n'existe pas, on renvoie une erreur 404
    if (!annotation) {
      res.status(404).send('Annotation non trouvée');
      return;
    }
  
    // Si le format demandé est "HTML", on renvoie une réponse HTML
    if (format === 'html') {
      var html = '<h1>' + annotation.URI + '</h1>' +
                 '<p>' + annotation.Commentaire + '</p>';
      res.send(html);
    }
    // Si le format demandé est "JSON", on renvoie une réponse JSON
    else if (format === 'json') {
      res.send(annotation);
    }
    // Sinon, on renvoie une erreur 400 car le format demandé n'est pas supporté
    else {
      res.status(400).send('Format de données non supporté');
    }
  });
  
  // Route pour récupérer toutes les annotations
app.get('/allAnnotations', function(req, res) {
    // Récupération du format de données depuis les paramètres de la requête
    var format = req.query.format;
  
    var annotation = annotations;
    // Si le format demandé est "HTML", on renvoie une réponse HTML
    if (format === 'html') {
        var html = '<ul>';
        var annotationList = Object.values(annotations);
        annotationList.forEach(function(annotation) {
          html += '<li>' + annotation.URI + ': ' + annotation.Commentaire + '</li>';
        });
        html += '</ul>';
        res.send(html);
    }
    // Si le format demandé est "JSON", on renvoie une réponse JSON
    else if (format === 'json') {
      res.send(annotation);
    }
    // Sinon, on renvoie une erreur 400 car le format demandé n'est pas supporté
    else {
      res.status(400).send('Format de données non supporté');
    }
  });
  
  app.get('/uriannotations', function(req, res) {
    var url = req.query.url;
    var format = req.accepts(['html', 'json']);
    if (!format) {
      res.status(406).send('Not Acceptable');
    } else if (format === 'html') {
      var html = '<ul>';
      var annotationList = Object.values(annotations).filter(function(annotation) {
        return annotation.URI === url;
      });
      annotationList.forEach(function(annotation) {
        html += '<li>' + annotation.URI + ': ' + annotation.Commentaire + '</li>';
      });
      html += '</ul>';
      res.send(html);
    } else if (format === 'json') {
      var annotationList = Object.values(annotations).filter(function(annotation) {
        return annotation.URI === url;
      });
      res.json(annotationList);
    }
  });
  

app.get("/toto", function(req,res){
    res.send("salut toto");
    }
);

app.listen(port, function(){
    console.log('serveur listening on port : '+port);
    }
);