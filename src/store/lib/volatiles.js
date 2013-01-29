
var http = require("http");
var redis = require("redis");

var VOLATILES_PREFIX = "volatiles";
var VOLATILES_TIMER_PREFIX = "timer";


var client = redis.createClient();

client.on("error", function (err)
{
    console.log("Got an error from the Redis client: " + err);
});


volatiles_timers = new Array();
timers_count = -1;


/**
 * volatileDefinition:
 * - src: where to get the fresh document from
 * - interval (optional): when to refresh the document
 * 
 * documentID: which document is to be resubmitted after the refresh
 */
exports.Volatile = function(volatileDefinition, documentID)
{
    this.DEFAULT_INTERVAL = 10;  // seconds...
    
    this.definition = JSON.parse(volatileDefinition);
    this.doc_id = documentID;
    
    
    this.subroutine = function(definition, doc_id)
    {
        console.log('\n[Volatile subroutine] =========================== BEGIN');
        
        console.log("Sending request to '%s'...", definition.src);
        
        // reload the document
        http.request(definition.src, function(res)
        {
            console.log("Sent request to '%s'", definition.src);
            
            if (res)
            {
                res.setEncoding("UTF-8");
                
                console.log('STATUS: ' + res.statusCode);
                console.log('HEADERS: ' + JSON.stringify(res.headers));
                
                res.on("data", function(chunk)
                {
                    console.log('All response: ' + chunk);   
                
                    if (res.statusCode == 200)
                    {
                        // re-add the doc with the same ID to the DB
                        client.set(doc_id, chunk);
                    }
                    
                    console.log('[Volatile subroutine] =========================== END\n');
                });
            }
            
        }).on("error", function(err)
        {
            console.log('Problem with request: ' + err.message);
            console.log('[Volatile subroutine] =========================== END\n');
            
        }).end();
    }
    
    this.initialize = function()
    {
        var int = this.DEFAULT_INTERVAL * 1000;
        
        if (this.definition.interval)
        {
            int = this.definition.interval * 1000;
        }
        
        if (int > 0)
        {
            var volatileTimerName = getVolatileTimerName(this.doc_id);
        
            // Instantiate a subroutine that periodically checks the URL:
            var timerID = setInterval(this.subroutine, int, this.definition, this.doc_id);
            
            // Save the timer into our array:
            volatiles_timers[++timers_count] = timerID;
            
            // Save the routine in the DB, so that we can resume it on a system reboot:
            client.set(volatileTimerName, timers_count);
            
            console.log("Saved volatile timerID '%s' for document '%s' with name '%s'", JSON.stringify(timerID), this.doc_id, volatileTimerName);
            console.log("Interval is '%d'", int);
        }
    };
};

function getVolatileTimerName(doc_id)
{
    return VOLATILES_PREFIX + ":" + doc_id + ":" + VOLATILES_TIMER_PREFIX;;
}

exports.VolatilesUtils = function()
{
    this.deleteVolatile = function(doc_id)
    {
        var volatileTimerName = getVolatileTimerName(doc_id);
        
        console.log('\n[deleteVolatile] =========================== BEGIN');
    
        client.get(volatileTimerName, function(err, timer_id)
        {
            if (timer_id)
            {
                var timer = volatiles_timers[timer_id];
                
                console.log("Deleting volatile timerID '%s' for document '%s'...", timer_id, doc_id);
                clearInterval(timer);
                
                console.log("Deleting volatile with name '%s'...", volatileTimerName);
                client.del(volatileTimerName);
                
                console.log('[deleteVolatile] =========================== END\n');
            }
        });
    };
};

exports.Expirable = function(expirableDefinition, doc_id, client)
{};

