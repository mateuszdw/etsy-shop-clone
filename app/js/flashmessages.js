function flash_window(type,mess,label){
    type = (type != null) ? type : 'modal'
    // hide all but dont touch #flash_error
    $('body').removeClass('flash_open')
    $('.f_outer .flash_window').hide();
    if(label){ $('#flash_'+type+' > h2 ').html(label) }
    if(mess){ $('#flash_'+type+' .content').html(mess) }

    $('body').addClass('flash_open')
    $('#flash_'+type).show();
    // set flash type
    $('.f_outer').fadeIn('fast');
}

function flash_window_close(type){
    $('body').removeClass('flash_open')
    if(type != null){
        $('#flash_'+type).fadeOut('fast');
        $('.f_outer').fadeOut('fast');
    } else {
        $('.f_outer').fadeOut('fast');
    }
}

$(document).ready(function() {
    $(".f_outer").on('click','.flash_close',function(e) {
        flash_window_close()
        e.preventDefault();
    });

    //close when click outside
    $(document).on('mousedown','.f_outer', function(e) {
        if($(e.target).is('.f_outer')){
            flash_window_close()
        }
    })
});
