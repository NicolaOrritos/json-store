
var http = require("http");
var redis = require("redis");
var documents = require("./documents");

var VOLATILES_PREFIX = "volatiles";
var VOLATILES_TIMER_FIELD = "timer";
var VOLATILES_DEFINITION_FIELD = "definition";


var client = redis.createClient();

client.on("error", function (err)
{
    console.log("Got an error from the Redis client: " + err);
});

function getVolatileName(doc_id)
{
    return VOLATILES_PREFIX + ":" + doc_id;
}


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
        
        client.hget(volatileTimerName, VOLATILES_TIMER_FIELD, function(err, is_active)
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
                                var utils = new documents.Utils();
                                utils.docFromDBString(chunk).save(function(){});
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
                console.log("Removing volatile for document '%s'...", self.doc_id);
                
                // Delete the timer from the DB
                client.hdel(VOLATILES_PREFIX, self.doc_id);
                
                console.log('[Volatile subroutine] =========================== END\n');
            }
        });
    }
    
    this.initialize = function()
    {
        if (this.interval > 0)
        {
            var volatile_name = getVolatileName(this.doc_id);
            
            // Instantiate a subroutine that periodically checks the URL:
            setTimeout(this.subroutine, this.interval, this);
            
            // "Mark" the routine as active in the DB:
            client.hset(volatile_name, VOLATILES_TIMER_FIELD, true);
            client.hset(volatile_name, VOLATILES_DEFINITION_FIELD, JSON.stringify(this.definition));
            
            client.sadd(VOLATILES_PREFIX, this.doc_id);
            
            console.log("Saved volatile timer for document '%s' under '%s' hash", this.doc_id, volatile_name);
            console.log("Interval is '%d'", this.interval);
        }
    };
};

exports.loadAll = function()
{
    console.log("\n[volatiles.loadAll] ======================== BEGIN");
    
    console.log("Initializing volatiles...");
    console.log("Requesting set '%s' to the DB...", VOLATILES_PREFIX);
    
    // Load all timers from the DB
    client.smembers(VOLATILES_PREFIX, function(err, result)
    {
        console.log("Got volatiles set: %s", result);
        
        if (result)
        {
            result.forEach(function(doc_id, position)
            {
                console.log("Got volatile for document '%s'", doc_id);
                
                var volatile_name = getVolatileName(doc_id);
                
                client.hgetall(volatile_name, function(err, hash)
                {
                    console.log("Got hash '%s'", JSON.stringify(hash));
                    
                    if (hash)
                    {
                        var definition = hash[VOLATILES_DEFINITION_FIELD];
                        
                        console.log("Creating volatile with definition '%s' and doc_id '%s' ...", definition, doc_id);
                        
                        var volatile = new exports.Volatile(definition, doc_id);
                        
                        volatile.initialize();
        
                        console.log("[volatiles.loadAll] ======================== END\n");
                    }
                });
            });
        }
    });
}

function getVolatileTimerName(doc_id)
{
    return VOLATILES_PREFIX + ":" + doc_id;
}

exports.VolatilesUtils = function()
{
    this.deleteVolatile = function(doc_id)
    {
        var volatileTimerName = getVolatileTimerName(doc_id);
        
        console.log('\n[deleteVolatile] =========================== BEGIN');
    
        client.hget(volatileTimerName, VOLATILES_TIMER_FIELD, function(err, timer_id)
        {
            if (timer_id)
            {
                console.log("Deleting volatile with name '%s'...", volatileTimerName);
                client.hset(volatileTimerName, VOLATILES_TIMER_FIELD, false);
                
                console.log('[deleteVolatile] =========================== END\n');
            }
        });
    };
};

