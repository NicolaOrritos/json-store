
/*
 * GET home page.
 */

var redis = require("redis");

var client = redis.createClient();

client.on("error", function (err)
{
    console.log("Got an error from the Redis client: " + err);
});


exports.index = function(req, res)
{
    client.dbsize(function(err, keys_count)
    {
        client.keys("*", function(err, keys)
        {
            var keys_arr = undefined;
        
            if (err)
            {
                keys_arr = "[error retrieving keys from the DB]";
            }
            else
            {
                keys_arr = keys.toString().split(",");
            }
            
            client.keys("tags*", function(err, tags_str)
            {
                var tags_count_text = "";
                var tags_arr = undefined;
            
                if (err)
                {
                    tags_count_text = "[error retrieving tags from the DB]"
                    tags_arr = "[error retrieving tags from the DB]";
                }
                else
                {
                    tags_arr = tags_str.toString().split(",");
                    
                    for (a=0; a<tags_arr.length; a++)
                    {
                        tags_arr[a] = tags_arr[a].substr(5);
                    }
                }
                
                res.render('index', {
                    keys_count: keys_count,
                    tags_count: tags_arr.length,
                    keys_arr: keys_arr,
                    tags_arr: tags_arr
                });
            });
        });
    });
};
