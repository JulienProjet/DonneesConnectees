var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');


const port = process.env.PORT || 3000;

var annotations={};
var id=0;

var app = express();

app.use(express.static("static"));

/*
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); //https://julienprojet.github.io
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    next();
});
*/
app.use(cors())
app.options('*', cors())

app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.redirect('/formulaire.html');
 }) 

app.post("/Annotation", cors(), function(req,res){
    var body = req.body;
    console.log("body :"+JSON.stringify(body));
    annotations[id]=body;
    console.log("liste annotations :"+JSON.stringify(annotations));
    id++;
    res.send("annotation ajoutée");    
    }
);

// Route pour récupérer une annotation par son identifiant
app.get('/IdAnnot/:Annot', (req, res) => {
  var IdAnnot = req.params.Annot;
  var annotation = annotations[IdAnnot];
  if (annotation) {
    // Si l'annotation existe, on la retourne au format JSON ou HTML en fonction de la négociation de contenu
    const acceptHeader = req.headers.accept;
    console.log(acceptHeader);
    if (acceptHeader == 'application/json') {
      res.setHeader('Content-type','application/json');
      res.send(annotation);
    } else {
      res.setHeader('Content-type','text/html');
      res.send(`<h1>${annotation.URI}</h1><p>${annotation.Commentaire}</p>`);
    }
  } else {
    // Si l'annotation n'existe pas, on retourne une erreur 404
    res.status(404).send('Annotation not found');
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
 
// Route pour récupérer toutes les annotations d'une URI
app.get('/uri', function(req, res) {
    var format = req.query.format;
    var url = req.query.url;
    var annotationList = Object.values(annotations).filter(annotation => annotation.URI === url);
    // Si le format demandé est "HTML", on renvoie une réponse HTML
    if (format == 'html') {
        var html = '<ul>';
        annotationList.forEach(function(annotation) {
          html += '<li>' + annotation.URI + ': ' + annotation.Commentaire + '</li>';
        });
        html += '</ul>';
        res.send(html);
    }
    // Si le format demandé est "JSON", on renvoie une réponse JSON
    else if (format == 'json') {
      res.send(annotationList);
    }
    // Sinon, on renvoie une erreur 400 car le format demandé n'est pas supporté
    else {
      res.status(400).send('Format de données non supporté');
    }
  });
  

app.listen(port, function(){
    console.log('serveur listening on port : '+port);
    }
);
