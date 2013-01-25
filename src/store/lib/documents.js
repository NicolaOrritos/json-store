
var hash = require('node_hash');

exports.Metadata = function(doc)
{
    this.id = hash.sha1(doc);

    this.date = new Date();
    this.tags = new Array();
};

exports.Document = function(metadata, payload)
{
    this.metadata = metadata;   // type is Metadata
    this.payload  = payload;    // type is a generic JSON
    
    this.asString = function()
    {
        return JSON.stringify(this);
    }
}

