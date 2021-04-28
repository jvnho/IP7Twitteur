new Vue({
    data : {
        isConnected : isConnected
    },
    el: '#user-menu-button'
})

new Vue({
    data : {
        isConnected : isConnected
    },
    el: '#user-form-publication'
})

Vue.component('publication', {
    props: ['publication', 'connected', 'user_id'],
    template:
    `
    <transition name="fade" appear>
        <div class="publication media border p-4 mt-5">
            <img v-bind:src="'../img/'+publication.picture" alt="" class="mr-3 mt-3 rounded-circle" style="width:125px;">
            <div class="media-body">
                <h4>{{publication.username}} <small><i>{{publication.date}}</i></small></h4>
                <p>{{publication.content}}</p>
                <div v-if="this.connected" class="d-flex align-items-end">
                    <button :data-publication="publication.publication_id" v-if="publication.liked" type="button" class="btn btn-primary unlike-publication">Publication aimée (<span>{{publication.nbr_like}}</span>)</button>
                    <button :data-publication="publication.publication_id" v-else type="button" class="btn btn-primary like-publication">Aimer la publication (<span>{{publication.nbr_like}}</span>)</button>

                    <button :data-author_id="publication.author_id" v-if="publication.subscribed == 0 && this.user_id !== publication.author_id" type="button" class="btn btn-primary sub">S'abonner</button>
                    <button :data-author_id="publication.author_id" v-else-if="this.user_id !== publication.author_id" type="button" class="btn btn-primary unsub">Abonné(e)</button>
                </div>
            </div>
        </div>
    </transition>
    `
})

var publications = new Vue({
    el: '#publications-container',
    data: {
        publications : publications,
        isConnected : isConnected,
        user_id: user_id
    }
})

$(document).ready(function(){
    publicationFormHandler();
    buttonHoverHandler();
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

function buttonHoverHandler(){
    var old_html = "";
    $(".unlike-publication, .unsub").mouseenter(function()
    {
        old_html = $(this).html();
        $(this).removeClass("btn-primary");
        $(this).addClass("btn-danger");
        if($(this).hasClass("unsub"))
            $(this).html("Se désabonner");
        else if($(this).hasClass("unlike-publication"))
            $(this).html("Ne plus aimer la publication");  
    })

    $(".unsub, .unlike-publication").mouseleave(function(){
        $(this).addClass("btn-primary");
        $(this).removeClass("btn-danger");
        $(this).html(old_html);
    })

    $(".like-publication, .sub").mouseenter(function()
    {
        $(this).removeClass("btn-primary");
        $(this).addClass("btn-success");
    })

    $(".sub, .like-publication").mouseleave(function(){
        $(this).addClass("btn-primary");
        $(this).removeClass("btn-success");
    })
}