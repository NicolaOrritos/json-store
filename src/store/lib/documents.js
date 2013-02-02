
var hash = require('node_hash');
var redis = require("redis");

var volatiles = require("./volatiles");


var client = redis.createClient();

client.on("error", function (err)
{
    console.log("Got an error from the Redis client: " + err);
});

var TAGS_PREFIX = "tags";


function pushVolatile(volatileDefinition, doc_id)
{
    if (volatileDefinition)
    {
        // Create the volatile object that holds the info needed
        var volatile = new volatiles.Volatile(volatileDefinition, doc_id);
        
        volatile.initialize();
    }
}

function popVolatile(doc_id)
{
    var utils = new volatiles.VolatilesUtils();
    
    utils.deleteVolatile(doc_id, client);
}

function pushExpirable(expires, doc_id)
{
    if (expires)
    {
        if (expires > 0)
        {
            client.expire(doc_id, expires);
            
            console.log("\nDocument with ID '%s' expires in '%d' seconds\n", doc_id, expires);
        }
    }
}


var Metadata = function(doc)
{
    this.id = hash.sha1(doc);

    this.date = new Date();
    this.tags = new Array();
};


exports.Document = function(raw_doc, tags, volatile_definition, expires)
{
    console.log("\nNEW DOCUMENT ===================== BEGIN");
    console.log("Received raw document '%s' [typeof '%s']", raw_doc, typeof(raw_doc));
    
    this.metadata = new Metadata(raw_doc);
    this.payload  = JSON.parse(raw_doc);
    
    if (tags)
    {
        tags_list = JSON.parse(tags);
        this.metadata.tags = tags_list;
    }
    
    this.metadata.volatile_definition = volatile_definition;
    this.metadata.expires = expires;
    
    
    this.save = function(callback, doc_id)
    {
        if (this.payload)
        {
            var SAVEDOC_SUCCESS = {"result": "OK"};
            var SAVEDOC_ERROR   = {"result": "ERROR", "cause": "unknown"};
            
            if (doc_id)
            {
                this.metadata.id = doc_id;
            }
            
            SAVEDOC_SUCCESS.doc_id = this.metadata.id;
            
            
            if (this.metadata.tags)
            {
                client.set(this.metadata.id, this.asString());
                
                // Answer early and then add tags
                callback.call(this, null, SAVEDOC_SUCCESS);
                
                var self = this;
                this.metadata.tags.forEach(function(tagName, index)
                {
                    var tag = TAGS_PREFIX + ":" + tagName;
                
                    console.log("[Document.save] Adding doc with ID '%s' to set '%s' [complete tag is '%s']", self.metadata.id , tagName, tag);
                    
                    // Associate the doc_id with each one of them:
                    client.sadd(tag, self.metadata.id);
                });
            }
            else
            {
                // no error: tags are optional
                client.set(this.metadata.id, this.asString());
                
                callback.call(this, null, SAVEDOC_SUCCESS);
            }
            
            console.log("[Document.save] Saved document '%s'", this.asString());
            
            
            pushVolatile(this.metadata.volatile_definition, this.metadata.id);
            pushExpirable(this.metadata.expires, this.metadata.id);
        }
        else
        {
            SAVEDOC_ERROR.cause = 'null_document';
            
            callback.call(this, SAVEDOC_ERROR, null);
        }
    };
    
    this.asString = function()
    {
        return JSON.stringify(this);
    };
    
    console.log("NEW DOCUMENT ===================== END\n");
};


exports.Utils = function()
{
    this.docFromString = function(doc_str)
    {
        if (doc_str)
        {
            var document = new exports.Document(doc_str);
            
            console.log("[Utils.docFromString] Returning Document:\n%s", JSON.stringify(document));
            
            return document;
        }
        else
        {
            return undefined;
        }
    };
    
    this.docFromDBString = function(doc_str)
    {
        if (doc_str)
        {
            var db_representation = JSON.parse(doc_str);
            var document = new exports.Document(JSON.stringify(db_representation.doc));
            
            console.log("[Utils.docFromDBString] Returning Document:\n%s", JSON.stringify(document));
            
            return document;
        }
        else
        {
            return undefined;
        }
    };
    
    this.getDoc = function(doc_id, callback)
    {
        var GETDOC_SUCCESS = {"result": "OK"};
        var GETDOC_ERROR   = {"result": "ERROR", "cause": "unknown"};
        
        if (doc_id)
        {
            client.get(doc_id, function (err, reply)
            {
                console.log("[Utils.getDoc] client replied with '%s' [typeof '%s']", reply, typeof(reply));
            
                if (reply)
                {
                    GETDOC_SUCCESS.doc = JSON.parse(reply);
                    
                    callback.call(this, null, GETDOC_SUCCESS);
                }
                else
                {
                    GETDOC_ERROR.cause = err ? err : "not_found";
                    
                    callback.call(this, GETDOC_ERROR, null);
                }
            });
        }
        else
        {
            GETDOC_ERROR.cause = 'null_doc_id';
                
            callback.call(this, GETDOC_ERROR, null);
        }
    };
    
    this.getDocs = function(tags_list, callback)
    {
        var GETDOCS_SUCCESS = {"result": "OK"};
        var GETDOCS_ERROR   = {"result": "ERROR", "cause": "unknown"};
        
        var result = new Array();
        
        console.log("[Utils.getDocs] Received the following tags_list: '%s'", tags_list);
        
        if (tags_list)
        {
            var tagsNames = tags_list.split(",");
            
            GETDOCS_SUCCESS.docs_ids = new Array();
            GETDOCS_SUCCESS.docs = new Object();
            
            var tags = new Array();
            
            console.log("[Utils.getDocs] asking sinter for the following tags:");
            tagsNames.forEach(function(tagName, position)
            {
                tags[position] = TAGS_PREFIX + ":" + tagName;
                
                console.log(" %d) %s [%s]", position, tagName, tags[position]);
            });
            
            client.sinter(tags, function(err, reply)
            {
                console.log("[Utils.getDocs] sinter replied with '%s'", reply);
            
                if (reply)
                {
                    client.mget(reply, function(err, reply)
                    {
                        console.log("[getdocs] mget replied with '%s' [typeof '%s']", reply, typeof(reply));
                    
                        if(reply)
                        {
                            reply.forEach(function(doc_str, position)
                            {
                                if (doc_str)
                                {
                                    var doc = JSON.parse(doc_str);
                                    
                                    console.log("saving doc_id '%s'", doc.metadata.id);
                                    console.log("with doc_str '%s'", doc_str);
                                    console.log("(position is '%d')", position);
                                    
                                    GETDOCS_SUCCESS.docs_ids[position] = doc.metadata.id;
                                    GETDOCS_SUCCESS.docs[doc.metadata.id] = doc;
                                }
                            });
                            
                            callback.call(this, null, GETDOCS_SUCCESS);
                        }
                        else if (err)
                        {
                            console.log("error retrieving doc: %s", err);
                            
                            GETDOCS_ERROR.cause = err;
                    
                            callback.call(this, GETDOCS_ERROR, null);
                        }
                        else
                        {
                            console.log("reply was undefined");
                            
                            GETDOCS_ERROR.cause = "not_found";
                    
                            callback.call(this, GETDOCS_ERROR, null);
                        }
                    });
                }
                else
                {
                    GETDOCS_ERROR.cause = "not_found";
                    
                    callback.call(this, GETDOCS_ERROR, null);
                }
            });
        }
        else
        {
            GETDOCS_ERROR.cause = 'no_tags';
                
            callback.call(this, GETDOCS_ERROR, null);
        }
    };
        
    this.deleteDoc = function(doc_id, callback)
    {
        var DELETEDOC_SUCCESS = {"result": "OK"};
        var DELETEDOC_ERROR   = {"result": "ERROR", "cause": "unknown"};
        
        if (doc_id)
        {
            client.del(doc_id, function (err, reply)
            {
                console.log("[Utils.deleteDoc] client replied with '%s' [typeof '%s']", reply, typeof(reply));
            
                if (reply)
                {
                    callback.call(undefined, DELETEDOC_SUCCESS);
                    
                    // Check and remove if it's a volatile:
                    popVolatile(doc_id);
                }
                else
                {
                    DELETEDOC_ERROR.cause = err ? err : "not_found";
                    
                    callback.call(DELETEDOC_ERROR, undefined);
                }
            });
        }
        else
        {
            DELETEDOC_ERROR.cause = 'null_doc_id';
                
            callback.call(DELETEDOC_ERROR, undefined);
        }
    };
};

