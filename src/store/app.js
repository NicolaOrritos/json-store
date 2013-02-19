
/**
 * Module dependencies.
 */

var express = require("express");
var cons = require('consolidate');
var swig = require('swig');
var redis = require("redis");

var client = redis.createClient();

client.on("error", function (err)
{
    console.log("Got an error from the Redis client: " + err);
});


var routes = {
                  'default': require('./routes/default'),
                  'store':   require('./routes/store')
             };

var app = express();


// Configuration

var PORT = 8124;

app.configure(function()
{
    app.engine('.html', cons.swig);
    app.set('view engine', 'html');
    
    swig.init({
        root: __dirname + '/views',
        allowErrors: true // allows errors to be thrown and caught by express instead of suppressed by Swig
    });
    
    app.set('views', __dirname + '/views');
    
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
app.post('/save', routes.store.savedoc);
app.get('/docs/:doc_id', routes.store.getdoc);
app.get('/docs/:doc_id/metadata', routes.store.getdocmetadata);
app.get('/docs', routes.store.getdocs);
app.get('/delete/:doc_id', routes.store.deletedoc);
app.get('/', routes.default.index);


// Load all volatiles:
var volatiles = require("./lib/volatiles");

volatiles.loadAll();


app.listen(PORT);

console.log("Express server listening on port %d in %s mode", PORT, app.settings.env);




