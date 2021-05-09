var isConnected = true;

function isFileImage(file) {
    return file && file['type'].split('/')[0] === 'image';
}

$(document).ready(function(){
    passwordInputHandle();
    submitPasswordChange();
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
            url: '/edit/password',
            data: {oldPassword: oldPassword, newPassword: newPassword},
            statusCode: 
            {
                400: function() {
                    $("#old-password").addClass("is-invalid").removeClass("is-valid");
                    $("#old-password").siblings(".invalid-feedback").html("Mots de passe incorrect");
                },
                200: function(){
                    showAlert();
                }
            }
        });
    });
}

function showAlert(){
    $('.alert').removeClass('d-none');
    setTimeout(function (){
        $('.alert').addClass('d-none');
    }, 3000);
}
