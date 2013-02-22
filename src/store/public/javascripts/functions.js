// remap jQuery to $
(function($){})(window.jQuery);


/* trigger when page is ready */
$(document).ready(function ()
{
    $("#tags-nav").click(function()
    {
        $("#content #tags-cont").show("fast");
        $("#content #keys-cont").hide("fast");
    });
    
    $("#keys-nav").click(function()
    {
        $("#content #tags-cont").hide("fast");
        $("#content #keys-cont").show("fast");
    });

});


