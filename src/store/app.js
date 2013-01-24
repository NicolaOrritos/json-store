
/**
 * Module dependencies.
 */

var express = require('express');

var gzip = require("gzip");
var routes = {
                  'default': require('./routes/default'),
                  'store':   require('./routes/store')
             };

var app = express();


// Configuration

var PORT = 8124;

app.configure(function()
{
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function()
{
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function()
{
  app.use(express.errorHandler()); 
});


// Routes
app.post('/savedoc', routes.store.savedoc);
app.get('/getdocs', routes.store.getdocs);
app.get('/getdoc/:doc_id', routes.store.getdoc);
app.get('/deletedoc/:doc_id', routes.store.deletedoc);
app.get('/', routes.default.index);


app.listen(PORT);

console.log("Express server listening on port %d in %s mode", PORT, app.settings.env);




