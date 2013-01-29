
var http = require("http");
var redis = require("redis");

var VOLATILES_PREFIX = "volatiles";
var VOLATILES_TIMER_PREFIX = "timer";


var client = redis.createClient();

client.on("error", function (err)
{
    console.log("Got an error from the Redis client: " + err);
});


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
    
    this.interval = this.DEFAULT_INTERVAL * 1000;
        
    if (this.definition.interval)
    {
        this.interval = this.definition.interval * 1000;
    }
    
    
    this.subroutine = function(self)
    {
        console.log('\n[Volatile subroutine] =========================== BEGIN');
        console.log("self is '%s'", self);
        
        // Check to see whether the volatile is still alive:
        var volatileTimerName = getVolatileTimerName(self.doc_id);
        
        console.log("volatileTimerName is '%s'", volatileTimerName);
        
        client.get(volatileTimerName, function(err, is_active)
        {
            console.log("is_active is '%s'", is_active);
            
            if (is_active == "true")
            {
                console.log("Renewing timer...");
            
                // Renew the timer:
                setTimeout(self.subroutine, self.interval, self);
                
                console.log("Sending request to '%s'...", self.definition.src);
                
                // reload the document
                http.request(self.definition.src, function(res)
                {
                    console.log("Sent request to '%s'", self.definition.src);
                    
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
                                client.set(self.doc_id, chunk);
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
            else
            {
                console.log("Removing volatile with name '%s'...", volatileTimerName);
                
                // Delete the timer from the DB
                client.del(volatileTimerName);
                
                console.log('[Volatile subroutine] =========================== END\n');
            }
        });
    }
    
    this.initialize = function()
    {
        if (this.interval > 0)
        {
            var volatileTimerName = getVolatileTimerName(this.doc_id);
        
            // Instantiate a subroutine that periodically checks the URL:
            setTimeout(this.subroutine, this.interval, this);
            
            // "Mark" the routine in the DB:
            client.set(volatileTimerName, true);
            
            console.log("Saved volatile timer for document '%s' with name '%s'", this.doc_id, volatileTimerName);
            console.log("Interval is '%d'", this.interval);
        }
    };
};

function getVolatileTimerName(doc_id)
{
    return VOLATILES_PREFIX + ":" + doc_id + ":" + VOLATILES_TIMER_PREFIX;
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
                console.log("Deleting volatile with name '%s'...", volatileTimerName);
                client.set(volatileTimerName, false);
                
                console.log('[deleteVolatile] =========================== END\n');
            }
        });
    };
};

exports.Expirable = function(expirableDefinition, doc_id, client)
{};

