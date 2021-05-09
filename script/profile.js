var isConnected = true;

function isFileImage(file) {
    return file && file['type'].split('/')[0] === 'image';
}

$(document).ready(function(){
    passwordInputHandle();
    submitPasswordChange();

    submitPicture();
});

function isSamePassword(){
    return $("#password").val() === $("#password-confirm").val() && $("#password").val() !== "";
}

function checkOldPassEntry(){
    return $("#old-password").val() !== "";
}

function toggleSubmitPassBtn(enable){
    if(enable){
        $("#submit-password").removeClass("btn-primary").addClass("btn-success");
        $("#submit-password").prop("disabled", !enable);
    } else {
        $("#submit-password").addClass("btn-primary").removeClass("btn-success");
        $("#submit-password").prop("disabled", !enable);
    }
}

function passwordInputHandle(){
    $("#old-password, #password, #password-confirm").keyup(function()
    {
        $("#submit-password").removeClass("btn-primary btn-success");
        $("#old-password").removeClass("is-valid is-invalid");
        $("#password").removeClass("is-valid is-invalid");
        $("#password-confirm").removeClass("is-valid is-invalid");
        if(isSamePassword() == false){
            toggleSubmitPassBtn(false);
            $(".twin-password").addClass("is-invalid");
            $(".twin-password").siblings(".invalid-feedback").html("Mots de passe non identiques");
        } else if(checkOldPassEntry() == false){
            toggleSubmitPassBtn(false);
            $("#old-password").addClass("is-invalid");
        } else {
            toggleSubmitPassBtn(true);
            $(".twin-password, #old-password").addClass("is-valid");
            
        }
    });
}

function submitPasswordChange(){
    $("#submit-password").click(function(e)
    {
        e.preventDefault();
        var oldPassword = $("#old-password").val();
        var newPassword = $("#password").val();
        $.ajax({
            type: "post",
            url: '/edit/password/',
            data: {oldPassword: oldPassword, newPassword: newPassword},
            statusCode: 
            {
                400: function() {
                    $("#old-password").addClass("is-invalid").removeClass("is-valid");
                    $("#old-password").siblings(".invalid-feedback").html("Mots de passe incorrect");
                },
                200: function(){
                    $("#notify-alert").html("Mot de passe changé avec succès.");
                    showAlert();
                }
            }
        });
    });
}


//source : https://mkyong.com/jquery/jquery-ajax-submit-a-multipart-form/
function submitPicture(){
    $("#submit-picture").click(function(e){
        e.preventDefault();

        $("#submit-picture").prop("disabled", true);
        var form = $('#change-picture')[0];
        var data = new FormData(form);
        console.log(data);
        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "/edit/picture/",
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            success: function (data) {
                $("#notify-alert").html("Photo de profil changé avec succès");
                showAlert();
            },
            error: function (e) {
                console.log("ERROR : ", e);
            }
        });
    })
}


function showAlert(){
    $('.alert').removeClass('d-none');
    setTimeout(function (){
        $('.alert').addClass('d-none');
    }, 3000);
}
