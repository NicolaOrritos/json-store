// remap jQuery to $
(function($){})(window.jQuery);


/* trigger when page is ready */
$(document).ready(function ()
{
    $("#tags-nav").click(function()
    {
        $("#content #tags-cont").show();
        $("#content #keys-cont").hide();
    });
    
    $("#keys-nav").click(function()
    {
        $("#content #tags-cont").hide();
        $("#content #keys-cont").show();
    });

});


