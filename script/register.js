$(document).ready(function(){
    checkFormValidity();
    submitFormHandler();
});

function submitFormHandler(){
    $("#submit").click(function(event){
        event.preventDefault();
        var formValid = true;
        $('.form-control').each(function(){
            if($(this).val() === "" || $(this).hasClass("is-valid") == false){
                $(this).addClass("is-invalid");
                formValid = false;
            }
        });
        if(formValid)
        {
            var username = $('#username').val();
            var password = $('#password').val();
            var email = $('#email').val();
            $.ajax({
                type: "post",
                url: '/register/',
                data: {username: username, password: password, email: email},
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

function checkFormValidity(){
    $("#username").change(function()
    {
        $(this).val($(this).val().trimEnd()); //enleve les espaces de fin qui ne sont pas dérangeants
        var username = $(this).val();
        $(this).removeClass("is-invalid");
        $(this).removeClass("is-valid");
        if(alreadyExists(username, true) == true){
            $(this).siblings(".invalid-feedback").html("Nom d'utilisateur déjà existant.");
            $(this).addClass("is-invalid");
        } else if(hasWhiteSpace(username) == true){ // espaces début et au milieu sont dérangeants
            $(this).siblings(".invalid-feedback").html("Nom d'utilisateur invalide.");
            $(this).addClass("is-invalid");
        } else if(username === ''){
            $(this).siblings(".invalid-feedback").html("Veillez remplir ce champ");
            $(this).addClass("is-invalid");
        }  else {
            $(this).addClass("is-valid");
        }
    });

    $("#email").change(function()
    {
        $(this).val($(this).val().trimEnd()); 
        var email = $(this).val();
        $(this).removeClass("is-invalid");
        $(this).removeClass("is-valid");
        if(alreadyExists(email, true) == true){
            $(this).siblings(".invalid-feedback").html("Adresse mail déjà utilisée.");
            $(this).addClass("is-invalid");
        } else if(checkEmailFormat(email) == false){
            $(this).siblings(".invalid-feedback").html("Veillez rentrer une adresse e-mail correct.");
            $(this).addClass("is-invalid");
        } else {
            $(this).addClass("is-valid");
        }
    });

    $("#password, #passwordConfirm").keyup(function(){
        var password = $("#password");
        var passwordConfirm = $("#passwordConfirm");
        password.removeClass("is-valid is-invalid")
        passwordConfirm.removeClass("is-valid is-invalid")
        if(password.val() === passwordConfirm.val() && password.val() !== '' && passwordConfirm.val() !== ''){
            password.addClass("is-valid");
            passwordConfirm.addClass("is-valid");
        } else {
            $(this).siblings(".invalid-feedback").html("Mots de passe non identiques");
            password.addClass("is-invalid");
            passwordConfirm.addClass("is-invalid");
        }
    });

    return true;
}

//vérifie si username ou l'email existe dans la BDD
function alreadyExists(data, username){
    var query;
    if(username == true)
        query = "SELECT username FROM user WHERE username = '" + data + "';";
    else 
    query = "SELECT email FROM user WHERE email = '" + data + "';";
    $.post("/register/existence", {query : query}, function(data){
        return data.existence; //true: email or username already exist
    });
}

function checkEmailFormat(email){
    //source: https://stackoverflow.com/questions/2507030/email-validation-using-jquery
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function hasWhiteSpace(s){
    return s.indexOf(' ') >= 0;
}

function showAlert(){
    $("body").prepend(
    '<div class="alert alert-danger alert-dismissible fade show text-center" role="alert">'+
        'Une erreur est survenue, veillez réessayer.'+
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
        '<span aria-hidden="true">&times;</span>'+
        '</button>'+
    '</div>');
        $('.alert').delay(2000).fadeOut('slow', function(){
            $(this).remove();
        })
}