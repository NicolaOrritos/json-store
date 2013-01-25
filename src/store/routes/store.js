
/*
 * POST a document and store it
 */

var redis = require("redis");

var documents = require("../lib/documents");


var client = redis.createClient();

client.on("error", function (err)
{
    console.log("Got an error from the Redis client: " + err);
});

// Example document:
/* {"title": "lonewolf",
"content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam fermentum ultricies arcu vel adipiscing. Phasellus convallis, nisl sed mattis bibendum, dui leo euismod urna, et ultricies lacus felis vel tellus. Cras arcu justo, egestas ac convallis blandit, luctus ac erat. Etiam luctus luctus ipsum a feugiat. Aliquam erat volutpat. Etiam venenatis dictum lacus, a dignissim leo tristique non. Sed quis nulla at lacus bibendum lobortis congue a lorem. Suspendisse non diam odio, eu rhoncus ligula. Nam vel tempus nisl. Aliquam placerat lorem ac orci pulvinar euismod. Proin non purus neque. Curabitur vel nibh ut ipsum aliquam molestie. Donec lacus nisi, consectetur in pellentesque eu, tempor nec risus. Praesent vel dui lectus. Suspendisse urna nisi, elementum a gravida sit amet, dignissim et ligula. Phasellus laoreet, dolor eu aliquam accumsan, quam diam varius libero, ut viverra urna nunc non erat. Fusce non neque metus. Praesent blandit, erat a feugiat volutpat, urna quam molestie tellus, sed feugiat metus enim et erat. Aenean ipsum elit, rutrum pharetra facilisis sit amet, tempor vel lectus. Nulla facilisi. Suspendisse potenti. Nullam pretium turpis sed libero blandit id varius ante condimentum. Pellentesque vel sapien ac tellus ornare vestibulum. Integer tincidunt ante vitae libero tempus feugiat. Suspendisse nisi orci, molestie ut sodales id, lobortis in risus. Pellentesque pharetra aliquet leo, in dictum nulla suscipit dapibus. Donec volutpat nunc elit, in volutpat odio. Mauris tortor nunc, porta sit amet condimentum nec, pretium id quam. Aliquam nec ipsum eu metus commodo facilisis. Duis at lectus eget felis ullamcorper fermentum a non elit. Aenean ut dolor erat, sed egestas purus. Nullam vitae eros orci. Donec vitae blandit risus. Nulla enim augue, semper sed sodales nec, ornare at ligula. Maecenas id felis ac velit consequat placerat quis vel sem. Praesent dapibus, quam in bibendum vulputate, odio metus lobortis sem, non tincidunt nibh purus eu lorem. Sed mattis, neque at vehicula facilisis, velit sapien fermentum justo, a molestie neque urna id erat. Nullam auctor quam mattis augue laoreet vitae tristique arcu elementum. Nam quis dui massa, eu vulputate libero. Maecenas eros ante, commodo vel convallis id, accumsan ut arcu. Nullam a ipsum sed turpis vulputate molestie. Maecenas in ante dui, quis dapibus elit. Cras tincidunt elit in est congue aliquam. Fusce a quam quis purus venenatis ultrices eu vehicula mi. Aenean hendrerit, lacus volutpat molestie volutpat, lectus arcu dapibus libero, eget lobortis nibh lectus et nisl. Fusce sit amet lacus sem, vitae pulvinar tellus. Suspendisse vitae mauris turpis. Donec eget tellus nulla, sed tristique dui. Nunc at nunc felis, sit amet suscipit massa. Proin purus libero, bibendum sed luctus sed, mollis ut turpis. Sed porttitor nisi sed libero eleifend dictum dictum turpis dictum. Fusce id libero nisl. Nullam rhoncus fringilla sapien vitae ullamcorper. Donec fermentum dictum dignissim. Morbi ac purus vel est elementum condimentum a eu sapien. Pellentesque mi turpis, gravida ut semper vitae, lobortis vitae orci. Fusce luctus, mi ut vulputate rutrum, sem nunc pellentesque massa, vel feugiat lacus tellus in leo. Aliquam erat volutpat. In laoreet sapien vitae velit vulputate auctor. Donec quam metus, pharetra porta convallis et, feugiat condimentum ipsum. Vestibulum congue ultricies faucibus. Praesent at libero libero. Morbi convallis augue eget augue pulvinar semper. In venenatis augue id nisi cursus quis imperdiet turpis tempus. Mauris lacus neque, fringilla vel laoreet et, cursus et augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam fermentum ultricies arcu vel adipiscing. Phasellus convallis, nisl sed mattis bibendum, dui leo euismod urna, et ultricies lacus felis vel tellus. Cras arcu justo, egestas ac convallis blandit, luctus ac erat. Etiam luctus luctus ipsum a feugiat. Aliquam erat volutpat. Etiam venenatis dictum lacus, a dignissim leo tristique non. Sed quis nulla at lacus bibendum lobortis congue a lorem. Suspendisse non diam odio, eu rhoncus ligula. Nam vel tempus nisl. Aliquam placerat lorem ac orci pulvinar euismod. Proin non purus neque. Curabitur vel nibh ut ipsum aliquam molestie. Donec lacus nisi, consectetur in pellentesque eu, tempor nec risus. Praesent vel dui lectus. Suspendisse urna nisi, elementum a gravida sit amet, dignissim et ligula. Phasellus laoreet, dolor eu aliquam accumsan, quam diam varius libero, ut viverra urna nunc non erat. Fusce non neque metus. Praesent blandit, erat a feugiat volutpat, urna quam molestie tellus, sed feugiat metus enim et erat. Aenean ipsum elit, rutrum pharetra facilisis sit amet, tempor vel lectus. Nulla facilisi. Suspendisse potenti. Nullam pretium turpis sed libero blandit id varius ante condimentum. Pellentesque vel sapien ac tellus ornare vestibulum. Integer tincidunt ante vitae libero tempus feugiat. Suspendisse nisi orci, molestie ut sodales id, lobortis in risus. Pellentesque pharetra aliquet leo, in dictum nulla suscipit dapibus. Donec volutpat nunc elit, in volutpat odio. Mauris tortor nunc, porta sit amet condimentum nec, pretium id quam. Aliquam nec ipsum eu metus commodo facilisis. Duis at lectus eget felis ullamcorper fermentum a non elit. Aenean ut dolor erat, sed egestas purus. Nullam vitae eros orci. Donec vitae blandit risus. Nulla enim augue, semper sed sodales nec, ornare at ligula. Maecenas id felis ac velit consequat placerat quis vel sem. Praesent dapibus, quam in bibendum vulputate, odio metus lobortis sem, non tincidunt nibh purus eu lorem. Sed mattis, neque at vehicula facilisis, velit sapien fermentum justo, a molestie neque urna id erat. Nullam auctor quam mattis augue laoreet vitae tristique arcu elementum. Nam quis dui massa, eu vulputate libero. Maecenas eros ante, commodo vel convallis id, accumsan ut arcu. Nullam a ipsum sed turpis vulputate molestie. Maecenas in ante dui, quis dapibus elit. Cras tincidunt elit in est congue aliquam. Fusce a quam quis purus venenatis ultrices eu vehicula mi. Aenean hendrerit, lacus volutpat molestie volutpat, lectus arcu dapibus libero, eget lobortis nibh lectus et nisl. Fusce sit amet lacus sem, vitae pulvinar tellus. Suspendisse vitae mauris turpis. Donec eget tellus nulla, sed tristique dui. Nunc at nunc felis, sit amet suscipit massa. Proin purus libero, bibendum sed luctus sed, mollis ut turpis. Sed porttitor nisi sed libero eleifend dictum dictum turpis dictum. Fusce id libero nisl. Nullam rhoncus fringilla sapien vitae ullamcorper. Donec fermentum dictum dignissim. Morbi ac purus vel est elementum condimentum a eu sapien. Pellentesque mi turpis, gravida ut semper vitae, lobortis vitae orci. Fusce luctus, mi ut vulputate rutrum, sem nunc pellentesque massa, vel feugiat lacus tellus in leo. Aliquam erat volutpat. In laoreet sapien vitae velit vulputate auctor. Donec quam metus, pharetra porta convallis et, feugiat condimentum ipsum. Vestibulum congue ultricies faucibus. Praesent at libero libero. Morbi convallis augue eget augue pulvinar semper. In venenatis augue id nisi cursus quis imperdiet turpis tempus. Mauris lacus neque, fringilla vel laoreet et, cursus et augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam fermentum ultricies arcu vel adipiscing. Phasellus convallis, nisl sed mattis bibendum, dui leo euismod urna, et ultricies lacus felis vel tellus. Cras arcu justo, egestas ac convallis blandit, luctus ac erat. Etiam luctus luctus ipsum a feugiat. Aliquam erat volutpat. Etiam venenatis dictum lacus, a dignissim leo tristique non. Sed quis nulla at lacus bibendum lobortis congue a lorem. Suspendisse non diam odio, eu rhoncus ligula. Nam vel tempus nisl. Aliquam placerat lorem ac orci pulvinar euismod. Proin non purus neque. Curabitur vel nibh ut ipsum aliquam molestie. Donec lacus nisi, consectetur in pellentesque eu, tempor nec risus. Praesent vel dui lectus. Suspendisse urna nisi, elementum a gravida sit amet, dignissim et ligula. Phasellus laoreet, dolor eu aliquam accumsan, quam diam varius libero, ut viverra urna nunc non erat. Fusce non neque metus. Praesent blandit, erat a feugiat volutpat, urna quam molestie tellus, sed feugiat metus enim et erat. Aenean ipsum elit, rutrum pharetra facilisis sit amet, tempor vel lectus. Nulla facilisi. Suspendisse potenti. Nullam pretium turpis sed libero blandit id varius ante condimentum. Pellentesque vel sapien ac tellus ornare vestibulum. Integer tincidunt ante vitae libero tempus feugiat. Suspendisse nisi orci, molestie ut sodales id, lobortis in risus. Pellentesque pharetra aliquet leo, in dictum nulla suscipit dapibus. Donec volutpat nunc elit, in volutpat odio. Mauris tortor nunc, porta sit amet condimentum nec, pretium id quam. Aliquam nec ipsum eu metus commodo facilisis. Duis at lectus eget felis ullamcorper fermentum a non elit. Aenean ut dolor erat, sed egestas purus. Nullam vitae eros orci. Donec vitae blandit risus. Nulla enim augue, semper sed sodales nec, ornare at ligula. Maecenas id felis ac velit consequat placerat quis vel sem. Praesent dapibus, quam in bibendum vulputate, odio metus lobortis sem, non tincidunt nibh purus eu lorem. Sed mattis, neque at vehicula facilisis, velit sapien fermentum justo, a molestie neque urna id erat. Nullam auctor quam mattis augue laoreet vitae tristique arcu elementum. Nam quis dui massa, eu vulputate libero. Maecenas eros ante, commodo vel convallis id, accumsan ut arcu. Nullam a ipsum sed turpis vulputate molestie. Maecenas in ante dui, quis dapibus elit. Cras tincidunt elit in est congue aliquam. Fusce a quam quis purus venenatis ultrices eu vehicula mi. Aenean hendrerit, lacus volutpat molestie volutpat, lectus arcu dapibus libero, eget lobortis nibh lectus et nisl. Fusce sit amet lacus sem, vitae pulvinar tellus. Suspendisse vitae mauris turpis. Donec eget tellus nulla, sed tristique dui. Nunc at nunc felis, sit amet suscipit massa. Proin purus libero, bibendum sed luctus sed, mollis ut turpis. Sed porttitor nisi sed libero eleifend dictum dictum turpis dictum. Fusce id libero nisl. Nullam rhoncus fringilla sapien vitae ullamcorper. Donec fermentum dictum dignissim. Morbi ac purus vel est elementum condimentum a eu sapien. Pellentesque mi turpis, gravida ut semper vitae, lobortis vitae orci. Fusce luctus, mi ut vulputate rutrum, sem nunc pellentesque massa, vel feugiat lacus tellus in leo. Aliquam erat volutpat. In laoreet sapien vitae velit vulputate auctor. Donec quam metus, pharetra porta convallis et, feugiat condimentum ipsum. Vestibulum congue ultricies faucibus. Praesent at libero libero. Morbi convallis augue eget augue pulvinar semper. In venenatis augue id nisi cursus quis imperdiet turpis tempus. Mauris lacus neque, fringilla vel laoreet et, cursus et augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam fermentum ultricies arcu vel adipiscing. Phasellus convallis, nisl sed mattis bibendum, dui leo euismod urna, et ultricies lacus felis vel tellus. Cras arcu justo, egestas ac convallis blandit, luctus ac erat. Etiam luctus luctus ipsum a feugiat. Aliquam erat volutpat. Etiam venenatis dictum lacus, a dignissim leo tristique non. Sed quis nulla at lacus bibendum lobortis congue a lorem. Suspendisse non diam odio, eu rhoncus ligula. Nam vel tempus nisl. Aliquam placerat lorem ac orci pulvinar euismod. Proin non purus neque. Curabitur vel nibh ut ipsum aliquam molestie. Donec lacus nisi, consectetur in pellentesque eu, tempor nec risus. Praesent vel dui lectus. Suspendisse urna nisi, elementum a gravida sit amet, dignissim et ligula. Phasellus laoreet, dolor eu aliquam accumsan, quam diam varius libero, ut viverra urna nunc non erat. Fusce non neque metus. Praesent blandit, erat a feugiat volutpat, urna quam molestie tellus, sed feugiat metus enim et erat. Aenean ipsum elit, rutrum pharetra facilisis sit amet, tempor vel lectus. Nulla facilisi. Suspendisse potenti. Nullam pretium turpis sed libero blandit id varius ante condimentum. Pellentesque vel sapien ac tellus ornare vestibulum. Integer tincidunt ante vitae libero tempus feugiat. Suspendisse nisi orci, molestie ut sodales id, lobortis in risus. Pellentesque pharetra aliquet leo, in dictum nulla suscipit dapibus. Donec volutpat nunc elit, in volutpat odio. Mauris tortor nunc, porta sit amet condimentum nec, pretium id quam. Aliquam nec ipsum eu metus commodo facilisis. Duis at lectus eget felis ullamcorper fermentum a non elit. Aenean ut dolor erat, sed egestas purus. Nullam vitae eros orci. Donec vitae blandit risus. Nulla enim augue, semper sed sodales nec, ornare at ligula. Maecenas id felis ac velit consequat placerat quis vel sem. Praesent dapibus, quam in bibendum vulputate, odio metus lobortis sem, non tincidunt nibh purus eu lorem. Sed mattis, neque at vehicula facilisis, velit sapien fermentum justo, a molestie neque urna id erat. Nullam auctor quam mattis augue laoreet vitae tristique arcu elementum. Nam quis dui massa, eu vulputate libero. Maecenas eros ante, commodo vel convallis id, accumsan ut arcu. Nullam a ipsum sed turpis vulputate molestie. Maecenas in ante dui, quis dapibus elit. Cras tincidunt elit in est congue aliquam. Fusce a quam quis purus venenatis ultrices eu vehicula mi. Aenean hendrerit, lacus volutpat molestie volutpat, lectus arcu dapibus libero, eget lobortis nibh lectus et nisl. Fusce sit amet lacus sem, vitae pulvinar tellus. Suspendisse vitae mauris turpis. Donec eget tellus nulla, sed tristique dui. Nunc at nunc felis, sit amet suscipit massa. Proin purus libero, bibendum sed luctus sed, mollis ut turpis. Sed porttitor nisi sed libero eleifend dictum dictum turpis dictum. Fusce id libero nisl. Nullam rhoncus fringilla sapien vitae ullamcorper. Donec fermentum dictum dignissim. Morbi ac purus vel est elementum condimentum a eu sapien. Pellentesque mi turpis, gravida ut semper vitae, lobortis vitae orci. Fusce luctus, mi ut vulputate rutrum, sem nunc pellentesque massa, vel feugiat lacus tellus in leo. Aliquam erat volutpat. In laoreet sapien vitae velit vulputate auctor. Donec quam metus, pharetra porta convallis et, feugiat condimentum ipsum. Vestibulum congue ultricies faucibus. Praesent at libero libero. Morbi convallis augue eget augue pulvinar semper. In venenatis augue id nisi cursus quis imperdiet turpis tempus. Mauris lacus neque, fringilla vel laoreet et, cursus et augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam fermentum ultricies arcu vel adipiscing. Phasellus convallis, nisl sed mattis bibendum, dui leo euismod urna, et ultricies lacus felis vel tellus. Cras arcu justo, egestas ac convallis blandit, luctus ac erat. Etiam luctus luctus ipsum a feugiat. Aliquam erat volutpat. Etiam venenatis dictum lacus, a dignissim leo tristique non. Sed quis nulla at lacus bibendum lobortis congue a lorem. Suspendisse non diam odio, eu rhoncus ligula. Nam vel tempus nisl. Aliquam placerat lorem ac orci pulvinar euismod. Proin non purus neque. Curabitur vel nibh ut ipsum aliquam molestie. Donec lacus nisi, consectetur in pellentesque eu, tempor nec risus. Praesent vel dui lectus. Suspendisse urna nisi, elementum a gravida sit amet, dignissim et ligula. Phasellus laoreet, dolor eu aliquam accumsan, quam diam varius libero, ut viverra urna nunc non erat. Fusce non neque metus. Praesent blandit, erat a feugiat volutpat, urna quam molestie tellus, sed feugiat metus enim et erat. Aenean ipsum elit, rutrum pharetra facilisis sit amet, tempor vel lectus. Nulla facilisi. Suspendisse potenti. Nullam pretium turpis sed libero blandit id varius ante condimentum. Pellentesque vel sapien ac tellus ornare vestibulum. Integer tincidunt ante vitae libero tempus feugiat. Suspendisse nisi orci, molestie ut sodales id, lobortis in risus. Pellentesque pharetra aliquet leo, in dictum nulla suscipit dapibus. Donec volutpat nunc elit, in volutpat odio. Mauris tortor nunc, porta sit amet condimentum nec, pretium id quam. Aliquam nec ipsum eu metus commodo facilisis. Duis at lectus eget felis ullamcorper fermentum a non elit. Aenean ut dolor erat, sed egestas purus. Nullam vitae eros orci. Donec vitae blandit risus. Nulla enim augue, semper sed sodales nec, ornare at ligula. Maecenas id felis ac velit consequat placerat quis vel sem. Praesent dapibus, quam in bibendum vulputate, odio metus lobortis sem, non tincidunt nibh purus eu lorem. Sed mattis, neque at vehicula facilisis, velit sapien fermentum justo, a molestie neque urna id erat. Nullam auctor quam mattis augue laoreet vitae tristique arcu elementum. Nam quis dui massa, eu vulputate libero. Maecenas eros ante, commodo vel convallis id, accumsan ut arcu. Nullam a ipsum sed turpis vulputate molestie. Maecenas in ante dui, quis dapibus elit. Cras tincidunt elit in est congue aliquam. Fusce a quam quis purus venenatis ultrices eu vehicula mi. Aenean hendrerit, lacus volutpat molestie volutpat, lectus arcu dapibus libero, eget lobortis nibh lectus et nisl. Fusce sit amet lacus sem, vitae pulvinar tellus. Suspendisse vitae mauris turpis. Donec eget tellus nulla, sed tristique dui. Nunc at nunc felis, sit amet suscipit massa. Proin purus libero, bibendum sed luctus sed, mollis ut turpis. Sed porttitor nisi sed libero eleifend dictum dictum turpis dictum. Fusce id libero nisl. Nullam rhoncus fringilla sapien vitae ullamcorper. Donec fermentum dictum dignissim. Morbi ac purus vel est elementum condimentum a eu sapien. Pellentesque mi turpis, gravida ut semper vitae, lobortis vitae orci. Fusce luctus, mi ut vulputate rutrum, sem nunc pellentesque massa, vel feugiat lacus tellus in leo. Aliquam erat volutpat. In laoreet sapien vitae velit vulputate auctor. Donec quam metus, pharetra porta convallis et, feugiat condimentum ipsum. Vestibulum congue ultricies faucibus. Praesent at libero libero. Morbi convallis augue eget augue pulvinar semper. In venenatis augue id nisi cursus quis imperdiet turpis tempus. Mauris lacus neque, fringilla vel laoreet et, cursus et augue.  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam fermentum ultricies arcu vel adipiscing. Phasellus convallis, nisl sed mattis bibendum, dui leo euismod urna, et ultricies lacus felis vel tellus. Cras arcu justo, egestas ac convallis blandit, luctus ac erat. Etiam luctus luctus ipsum a feugiat. Aliquam erat volutpat. Etiam venenatis dictum lacus, a dignissim leo tristique non. Sed quis nulla at lacus bibendum lobortis congue a lorem. Suspendisse non diam odio, eu rhoncus ligula. Nam vel tempus nisl. Aliquam placerat lorem ac orci pulvinar euismod. Proin non purus neque. Curabitur vel nibh ut ipsum aliquam molestie. Donec lacus nisi, consectetur in pellentesque eu, tempor nec risus. Praesent vel dui lectus. Suspendisse urna nisi, elementum a gravida sit amet, dignissim et ligula. Phasellus laoreet, dolor eu aliquam accumsan, quam diam varius libero, ut viverra urna nunc non erat. Fusce non neque metus. Praesent blandit, erat a feugiat volutpat, urna quam molestie tellus, sed feugiat metus enim et erat. Aenean ipsum elit, rutrum pharetra facilisis sit amet, tempor vel lectus. Nulla facilisi. Suspendisse potenti. Nullam pretium turpis sed libero blandit id varius ante condimentum. Pellentesque vel sapien ac tellus ornare vestibulum. Integer tincidunt ante vitae libero tempus feugiat. Suspendisse nisi orci, molestie ut sodales id, lobortis in risus. Pellentesque pharetra aliquet leo, in dictum nulla suscipit dapibus. Donec volutpat nunc elit, in volutpat odio. Mauris tortor nunc, porta sit amet condimentum nec, pretium id quam. Aliquam nec ipsum eu metus commodo facilisis. Duis at lectus eget felis ullamcorper fermentum a non elit. Aenean ut dolor erat, sed egestas purus. Nullam vitae eros orci. Donec vitae blandit risus. Nulla enim augue, semper sed sodales nec, ornare at ligula. Maecenas id felis ac velit consequat placerat quis vel sem. Praesent dapibus, quam in bibendum vulputate, odio metus lobortis sem, non tincidunt nibh purus eu lorem. Sed mattis, neque at vehicula facilisis, velit sapien fermentum justo, a molestie neque urna id erat. Nullam auctor quam mattis augue laoreet vitae tristique arcu elementum. Nam quis dui massa, eu vulputate libero. Maecenas eros ante, commodo vel convallis id, accumsan ut arcu. Nullam a ipsum sed turpis vulputate molestie. Maecenas in ante dui, quis dapibus elit. Cras tincidunt elit in est congue aliquam. Fusce a quam quis purus venenatis ultrices eu vehicula mi. Aenean hendrerit, lacus volutpat molestie volutpat, lectus arcu dapibus libero, eget lobortis nibh lectus et nisl. Fusce sit amet lacus sem, vitae pulvinar tellus. Suspendisse vitae mauris turpis. Donec eget tellus nulla, sed tristique dui. Nunc at nunc felis, sit amet suscipit massa. Proin purus libero, bibendum sed luctus sed, mollis ut turpis. Sed porttitor nisi sed libero eleifend dictum dictum turpis dictum. Fusce id libero nisl. Nullam rhoncus fringilla sapien vitae ullamcorper. Donec fermentum dictum dignissim. Morbi ac purus vel est elementum condimentum a eu sapien. Pellentesque mi turpis, gravida ut semper vitae, lobortis vitae orci. Fusce luctus, mi ut vulputate rutrum, sem nunc pellentesque massa, vel feugiat lacus tellus in leo. Aliquam erat volutpat. In laoreet sapien vitae velit vulputate auctor. Donec quam metus, pharetra porta convallis et, feugiat condimentum ipsum. Vestibulum congue ultricies faucibus. Praesent at libero libero. Morbi convallis augue eget augue pulvinar semper. In venenatis augue id nisi cursus quis imperdiet turpis tempus. Mauris lacus neque, fringilla vel laoreet et, cursus et augue."} */

/** In POST:
 *   - "doc": a document to be stored
 *   - "tags": [optional] a list of tags associated to the document
 *  
 *  res:
 *   - "result": OK or ERROR
 *   - "cause": if "result" = ERROR then "cause" contains the type/reason of the error
 */
exports.savedoc = function(req, res)
{
    var SAVEDOC_SUCCESS = {"result": "OK"};
    var SAVEDOC_ERROR   = {"result": "ERROR", "cause": "unknown"};

    var doc = req.param("doc");
    var tags = req.param("tags");
    
    if (doc)
    {
        console.log("Received JSON document '%s' [typeof '%s']", doc, typeof(doc));
        
        var metadata = new documents.Metadata(doc);
        document = new documents.Document(metadata, JSON.parse(doc));
        
        SAVEDOC_SUCCESS.doc_id = document.metadata.id;
        
        
        if (tags)
        {
            tags_list = JSON.parse(tags);
            
            document.metadata.tags = tags_list;
            
            client.set(document.metadata.id, document.asString());
            
            // Answer early and then add tags
            res.send(SAVEDOC_SUCCESS);
            
        
            tags_list.forEach(function(tag, index)
            {
                console.log("Adding doc with ID '%s' to set '%s'",document.metadata.id , tag);
                
                // Associate the doc_id with each one of them:
                client.sadd(tag, document.metadata.id);
            });
        }
        else
        {
            // no error: tags are optional
            client.set(document.metadata.id, document.asString());
            
            res.send(SAVEDOC_SUCCESS);
        }
        
        console.log("Saved document '%s'", document.asString());
    }
    else
    {
        SAVEDOC_ERROR.cause = 'null_document';
    
        res.send(SAVEDOC_ERROR);
    }
};

/** req:
 *   - "doc_id": the ID of the document to be deleted
 *  
 *  res:
 *   - "result": OK or ERROR
 *   - "cause": if "result" = ERROR then "cause" contains the type/reason of the error
 */
exports.deletedoc = function(req, res)
{
    var DELETEDOC_SUCCESS = {"result": "OK"};
    var DELETEDOC_ERROR   = {"result": "ERROR", "cause": "unknown"};
    
    var doc_id = req.param("doc_id");
    
    if (doc_id)
    {
        client.del(doc_id, function (err, reply)
        {
            console.log("client replied with '%s' [typeof '%s']", reply, typeof(reply));
        
            if (reply)
            {
                res.send(DELETEDOC_SUCCESS);
            }
            else
            {
                DELETEDOC_ERROR.cause = err ? err : "not_found";
                
                res.send(DELETEDOC_ERROR);
            }
        });
    }
    else
    {
        DELETEDOC_ERROR.cause = 'null_doc_id';
            
        res.send(DELETEDOC_ERROR);
    }
}

/** req:
 *   - "doc_id": the ID of the document to be retrieved
 *  
 *  res:
 *   - "result": OK or ERROR
 *   - "cause": if "result" = ERROR then "cause" contains the type/reason of the error
 */
exports.getdoc = function(req, res)
{
    var GETDOC_SUCCESS = {"result": "OK"};
    var GETDOC_ERROR   = {"result": "ERROR", "cause": "unknown"};
    
    var doc_id = req.param("doc_id");
    
    if (doc_id)
    {
        client.get(doc_id, function (err, reply)
        {
            console.log("client replied with '%s' [typeof '%s']", reply, typeof(reply));
        
            if (reply)
            {
                GETDOC_SUCCESS.doc = JSON.parse(reply);
                
                res.send(GETDOC_SUCCESS);
            }
            else
            {
                GETDOC_ERROR.cause = err ? err : "not_found";
                
                res.send(GETDOC_ERROR);
            }
        });
    }
    else
    {
        GETDOC_ERROR.cause = 'null_doc_id';
            
        res.send(GETDOC_ERROR);
    }
};

/** req:
 *   - "tags": an array of tags (strings)
 *  
 *  res:
 *   - "result": OK or ERROR
 *   - "cause": if "result" = ERROR then "cause" contains the type/reason of the error
 */
exports.getdocs = function(req, res)
{
    var GETDOCS_SUCCESS = {"result": "OK"};
    var GETDOCS_ERROR   = {"result": "ERROR", "cause": "unknown"};
    
    var result = new Array();
    
    var tags_list = req.query.tags;
    
    if (tags_list)
    {
        var tags = tags_list.split(",");
        
        GETDOCS_SUCCESS.docs_ids = new Array();
        GETDOCS_SUCCESS.docs = new Object();
        
        console.log("[getdocs] asking sinter for the following tags:");
        tags.forEach(function(tag, position)
        {
            console.log("%d) %s", position, tag);
        });
        
        client.sinter(tags, function(err, reply)
        {
            console.log("[getdocs] sinter replied with '%s'", reply);
        
            if (reply)
            {
                client.mget(reply, function(err, reply)
                {
                    console.log("[getdocs] mget replied with '%s' [typeof '%s']", reply, typeof(reply));
                
                    if(reply)
                    {
                        reply.forEach(function(doc_str, position)
                        {
                            var doc = JSON.parse(doc_str);
                            
                            console.log("saving doc_id '%s'", doc.id);
                            console.log("with doc_str '%s'", doc_str);
                            console.log("(position is '%d')", position);
                            
                            GETDOCS_SUCCESS.docs_ids[position] = doc.id;
                            GETDOCS_SUCCESS.docs[doc.id] = doc;
                        });
                        
                        res.send(GETDOCS_SUCCESS);
                    }
                    else if (err)
                    {
                        console.log("error retrieving doc: %s", err);
                        
                        GETDOCS_ERROR.cause = err;
                
                        res.send(GETDOCS_ERROR);
                    }
                    else
                    {
                        console.log("reply was undefined");
                        
                        GETDOCS_ERROR.cause = "not_found";
                
                        res.send(GETDOCS_ERROR);
                    }
                });
            }
            else
            {
                GETDOCS_ERROR.cause = "not_found";
                
                res.send(GETDOCS_ERROR);
            }
        });
    }
    else
    {
        GETDOCS_ERROR.cause = 'no_tags';
            
        res.send(GETDOCS_ERROR);
    }
}


