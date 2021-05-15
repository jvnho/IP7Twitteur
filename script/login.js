$(document).ready(function(){
    inputTextHandler();
    loginButtonHandle();
});

function loginButtonHandle(){
    $("#submit").click(function(event){
        var submitBtn = $(this);
        submitBtn.prop("disabled", true);
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
                        submitBtn.prop("disabled", false);
                        showAlert();
                        $(".form-control").addClass("is-invalid");
                    },
                    200: function(){
                        window.location.href = '/home';
                    }
                }
            });
        }
        submitBtn.prop("disabled", false);
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
    $('#notify-alert').removeClass('d-none');
}