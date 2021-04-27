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
    props: ['publication', 'connected'],
    template:
    `
    <div class="publication media border p-4 mt-5">
        <img v-bind:src="'../img/'+publication.picture" alt="" class="mr-3 mt-3 rounded-circle" style="width:125px;">
        <div class="media-body">
            <h4>{{publication.username}} <small><i>{{publication.date}}</i></small></h4>
            <p>{{publication.content}}</p>
            <div v-if="this.connected"class="d-flex align-items-end">
                <button v-if="publication.liked" type="button" class="btn btn-primary like-publication">Ne plus aimer <small>({{publication.nbr_like}})</small></button>
                <button v-else type="button" class="btn btn-primary unlike-publication">Aimer <small>({{publication.nbr_like}})</small></button>

                <button v-if="publication.subscribed" type="button" class="btn btn-primary like-publication">S'abonner</button>
                <button v-else type="button" class="btn btn-primary unlike-publication">Ne plus être abonné</button>
            </div>
        </div>
    </div>
    `
})

new Vue({
    el: '#publications-container',
    data: {
        publications : publications,
        isConnected : isConnected
    }
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