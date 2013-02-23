// remap jQuery to $
(function($){})(window.jQuery);


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
    });
    
    $("#docs-subnav #byid-search").click(function()
    {
        $("#content #docs-search #search-bytags").hide("fast");
        $("#content #docs-search #search-byid").show("fast");
    });

});


