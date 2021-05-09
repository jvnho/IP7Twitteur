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
                url: '/register',
                data: {username: username, password: password, email: email},
                statusCode: 
                {
                    400: function() {
                        showAlert();
                        $(".form-control").addClass("is-invalid");
                    },
                    200: function(){
                        window.location.href = '/login?register=sucess';
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
        $.when(alreadyExists(username, true)).done(function(res)
        {
            var usernameInput = $("#username");
            if(res.existence)
            {
                usernameInput.siblings(".invalid-feedback").html("Nom d'utilisateur déjà existant.");
                usernameInput.addClass("is-invalid");
            }
            else if(hasWhiteSpace(username) == true){ // espaces début et au milieu sont dérangeants
                usernameInput.siblings(".invalid-feedback").html("Nom d'utilisateur invalide.");
                usernameInput.addClass("is-invalid");
            } else if(username === ''){
                usernameInput.siblings(".invalid-feedback").html("Veillez remplir ce champ");
                usernameInput.addClass("is-invalid");
            } else {
                usernameInput.addClass("is-valid");
            }
        });
    });

    $("#email").change(function()
    {
        $(this).val($(this).val().trimEnd()); 
        var email = $(this).val();
        $(this).removeClass("is-invalid");
        $(this).removeClass("is-valid");
        $.when(alreadyExists(email, false)).done(function(res){
            var emailInput = $("#email");
            if(res.existence)
            {
                emailInput.siblings(".invalid-feedback").html("Adresse mail déjà utilisée.");
                emailInput.addClass("is-invalid");
            } else if(checkEmailFormat(email) == false){
                emailInput.siblings(".invalid-feedback").html("Veillez rentrer une adresse e-mail correct.");
                emailInput.addClass("is-invalid");
            } else {
                emailInput.addClass("is-valid");
            }
        });
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
}

//vérifie si username ou l'email existe dans la BDD
function alreadyExists(data, checkUsername){
    var query;
    if(checkUsername == true)
        query = "SELECT username FROM user WHERE username = '" + data + "';";
    else 
        query = "SELECT email FROM user WHERE email = '" + data + "';";
    return $.ajax({
        method: "POST",
        url: "/register/existence",
        data : {query : query},
    }).done();
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
    $('.alert').removeClass('d-none');
    setTimeout(function (){
        $('.alert').addClass('d-none');
    }, 3000);
}