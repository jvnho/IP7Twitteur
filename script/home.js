var userMenu = new Vue({
    data : {
        isConnected : isConnected
    },
    el: '#user-menu-button'
})

var userTextArea = new Vue({
    data : {
        isConnected : isConnected
    },
    el: '#user-form-publication'
})

$(document).ready(function(){
    publicationFormHandler();
});

function publicationFormHandler(){
    $("#publish-message").click(function(event){
        event.preventDefault();
        if($('#publication-text').val().length > 280){
            $("#user-publication-error").html("Message ne doit pas excéder 280 caractères.");
        } else if($('#publication-text').val().length == 0){ 
            $("#user-publication-error").html("Champ de texte vide");
        } else {
            return $.ajax(
            {
                type: "post",
                url: "/home/publish/",
                data: { content: $('#publication-text').val()},
            }).done();
        }
    })
}