$(document).ready(function(){
    inputTextHandler();
    loginButtonHandle();
});

function loginButtonHandle(){
    $("#submit").click(function(event){
        event.preventDefault(); 
        $(".form-control").removeClass("is-invalid");
        $(".form-control").removeClass("is-valid");
        var username = $("#username").val();
        var password = $("#password").val();
        if( username !== '' && password !== '')
        {
            $.ajax({
                type: "post",
                url: '/login/',
                data: {username: username, password: password},
                statusCode: 
                {
                    400: function() {
                        showAlert();
                        $(".form-control").addClass("is-invalid");
                    },
                    200: function(){
                        window.location.href = '/home/';
                    }
                }
            });
        }
    });
}

function inputTextHandler(){
    $(".form-control").keyup(function(){
        $(this).removeClass("is-invalid");
        $(this).removeClass("is-valid");
        if($(this).val() === ''){
            $(this).addClass("is-invalid");
        } else {
            $(this).addClass("is-valid");
        }
    });
}

function showAlert(){
    $("body").prepend(
    '<div class="alert alert-danger alert-dismissible fade show text-center" role="alert">'+
        'Utilisateur non existant ou mot de passe incorrect.'+
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
        '<span aria-hidden="true">&times;</span>'+
        '</button>'+
    '</div>');
        $('.alert').delay(2000).fadeOut('slow', function(){
            $(this).remove();
        })
}