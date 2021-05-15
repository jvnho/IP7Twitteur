var isConnected = true;

function isFileImage(file) {
    return file && file['type'].split('/')[0] === 'image';
}

$(document).ready(function(){
    passwordInputHandle();
    submitPasswordChange();

    pictureInputHandle();
    submitPicture();
    resetProfilePic();
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
        var submitBtn = $(this);
        submitBtn.prop("disabled", true);
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
                    submitBtn.prop("disabled", false);
                },
                200: function(){
                    $("#notify-alert").html("Mot de passe changé avec succès.");
                    showAlert();
                    submitBtn.prop("disabled", false);
                }
            }
        });
    });
}

function pictureInputHandle(){
    $("#img-input").change(function(){
        var validImageTypes = ["jpg", "jpeg", "png"];
        if ($.inArray($(this).val().split('.').pop().toLowerCase(), validImageTypes) == -1){
            $('#submit-picture').prop("disabled",true);
            $('#submit-picture').removeClass('btn-primary').addClass('btn-danger');
        } else {
            $('#submit-picture').removeClass('btn-danger btn-primary').addClass('btn-success');
            $('#submit-picture').prop("disabled",false);
        }
    });
}

//source : https://mkyong.com/jquery/jquery-ajax-submit-a-multipart-form/
function submitPicture(){
    $("#submit-picture").click(function(e){
        e.preventDefault();
        $("#submit-picture").prop("disabled", true);
        var form = $('#change-picture')[0];
        var data = new FormData(form);
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
                $("#submit-picture").prop("disabled", false);
            },
            error: function (e) {
                console.log("ERROR : ", e);
                $("#submit-picture").prop("disabled", false);
            }
        });
    })
}


function resetProfilePic(){
    $("#reset-picture").click(function(e){
        var resetBtn = $(this);
        resetBtn.prop("disabled", true);
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/edit/picture/reset",
            success: function (data) {
                $("#notify-alert").html("Photo de profil supprimé avec succès");
                showAlert();
                resetBtn.prop("disabled", false);
            },
            error: function (e) {
                console.log("ERROR : ", e);
                resetBtn.prop("disabled", false);
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
