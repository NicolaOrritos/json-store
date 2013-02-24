// remap jQuery to $
(function($){})(window.jQuery);


String.prototype.killWhitespaces = function() {
    return this.replace(/\s/g, '');
};


/* trigger when page is ready */
$(document).ready(function ()
{
    $("#tags-nav").click(function()
    {
        $("#content #tags-cont").show("fast");
        $("#content #ids-cont").hide("fast");
        $("#content #docs-search").hide("fast");
        
        $("#subnav #docs-subnav").hide("fast");
    });
    
    $("#ids-nav").click(function()
    {
        $("#content #tags-cont").hide("fast");
        $("#content #ids-cont").show("fast");
        $("#content #docs-search").hide("fast");
        
        $("#subnav #docs-subnav").hide("fast");
    });
    
    $("#docs-nav").click(function()
    {
        $("#content #tags-cont").hide("fast");
        $("#content #ids-cont").hide("fast");
        $("#content #docs-search").show("fast");
        
        $("#subnav #docs-subnav").show("fast");
    });
    
    $("#docs-subnav #bytags-search").click(function()
    {
        $("#content #docs-search #search-bytags").show("fast");
        $("#content #docs-search #search-byid").hide("fast");
        
        $("#docs-search .results").clean();
    });
    
    $("#docs-subnav #byid-search").click(function()
    {
        $("#content #docs-search #search-bytags").hide("fast");
        $("#content #docs-search #search-byid").show("fast");
        
        $("#docs-search .results").clean();
    });
    
    $("#search-byid a").click(function()
    {
        var id = $("#search-byid input").val();
        
        console.log("id: " + id);
        
        $.getJSON('docs/' + id, function(data) {
            
            console.log("JSON returned:\n" + JSON.stringify(data));
            
            data.forEach(function(doc, position)
            {
                
            });
            
        });
    });
    
    $("#search-bytags a").click(function()
    {
        var tags = $("#search-bytags input").val().killWhitespaces();
        
        console.log("tags: " + tags);
        
        $.getJSON('docs?tags=' + tags, function(data) {
            
            console.log("JSON returned:\n" + JSON.stringify(data));
            
            data.forEach(function(doc, position)
            {
                
            });
            
        });
    });

});


