
/*
 * GET home page.
 */

var redis = require("redis");

var client = redis.createClient();

client.on("error", function (err)
{
    console.log("Got an error from the Redis client: " + err);
});


if (typeof String.prototype.startsWith != 'function')
{
    String.prototype.startsWith = function (str)
    {
        return this.slice(0, str.length) == str;
    };
}

if (typeof String.prototype.endsWith != 'function')
{
    String.prototype.endsWith = function (str)
    {
        return this.slice(-str.length) == str;
    };
}


exports.index = function(req, res)
{
    client.keys("*", function(err, keys)
    {
        var keys_arr_filtered = undefined;
    
        if (keys)
        {
            var keys_arr = keys.toString().split(",");
            keys_arr_filtered = new Array();
            
            for (a=b=0; a<keys_arr.length; a++)
            {
                if (!keys_arr[a].startsWith("tags:"))
                {
                    keys_arr_filtered[b++] = keys_arr[a];
                }
            }
        }
        
        client.keys("tags:*", function(err, tags_str)
        {
            var tags_arr = undefined;
        
            if (tags_str)
            {
                tags_arr = tags_str.toString().split(",");
                
                for (a=0; a<tags_arr.length; a++)
                {
                    tags_arr[a] = tags_arr[a].substr(5);
                }
            }
            
            res.render('index', {
                keys_count: keys_arr_filtered ? keys_arr_filtered.length : "[error retrieving keys from the DB]",
                tags_count: tags_arr ? tags_arr.length : "[error retrieving tags from the DB]",
                keys_arr: keys_arr_filtered,
                tags_arr: tags_arr
            });
        });
    });
};
