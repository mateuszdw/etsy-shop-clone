$(function(){ // on dom ready

    $('body').on('click','a.trackga', function() {
        if(typeof ga == 'undefined') { return }
        ga('send', 'pageview', $(this).attr('href'));
    });

    $('body').on('click','a.product-buy', function() {
        if(typeof ga == 'undefined') { return }
        ga('send', 'event', 'product-buy-button', 'click');
    });

    $.scrollIt({
        topOffset: -96
    });

    //slidetoggle
    $('.toggler').click(function(){
        $(this).parents(".toggler-preview").children('.toggler-me').slideToggle('fast');
        return false; //ensures no anchor jump
    });


    $('a.product-policies').click(function(e){
        flash_window('modal',$('#policies_content').html(),'Shop Terms & Policies')
        e.preventDefault();
    })

    $('a.aboutus').click(function(e){
        flash_window('modal',$('#aboutus_content').html(),'About Us')
        e.preventDefault();
    })

});