var index = publications.length;

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
    data : 
    function(){
        return {
            content : ""
        }
    },
    methods: 
    {
        addLink: function(str){
            const regExprTag = /#\w+/g;
            const regExprAt = /@\w+/g;
            this.content = str.replace(regExprTag, (x) => {
                    return '<a style="text-decoration: none;cursor:pointer;" data-hashtag="'+ x.replace("#","") + '" class="hashtag-clicked"><kbd>' + x +'</kbd></a>'
            }).replace(regExprAt, (x) => {
                    return '<a style="text-decoration: none;cursor:pointer;" data-at="'+ x.replace("@","") + '" class="user-clicked"><kbd>' + x +'</kbd></a>' 
            });
            return this.content
        }
    },
    template:
    `
    <transition name="fade" appear>
        <div class="publication media border p-4 mt-5">
            <img v-bind:src="'../img/'+publication.picture" alt="" class="mr-3 mt-3 rounded-circle" style="width:125px;">
            <div class="media-body">
                <h4>{{publication.username}} <small><i>{{publication.date}}</i></small></h4>
                <p v-html="addLink(publication.content)"></p>
                <div v-if="this.connected && this.user_id !== publication.author_id" class="d-flex align-items-end">
                    <button :data-publication="publication.publication_id" v-if="publication.liked" type="button" class="btn btn-primary unlike-publication">Publication aimée (<span class="number-likes">{{publication.nbr_like}}</span>)</button>
                    <button :data-publication="publication.publication_id" v-else type="button" class="btn btn-primary like-publication">Aimer la publication (<span class="number-likes">{{publication.nbr_like}}</span>)</button>
                    <button :data-author_id="publication.author_id" v-if="publication.subscribed == 0" type="button" class="btn btn-primary sub">S'abonner</button>
                    <button :data-author_id="publication.author_id" v-else type="button" class="btn btn-primary unsub">Abonné(e)</button>
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
    publishMessage();
    publicationButtonHover();
    publicationButtonClick();
    changePublicationType();
    makeResearch();
    hashtagClick();
    userNameClick();
    setInterval(updatePublications, 5000);
});


function updatePublications(){
    /*
    if(publicationType === "search"){
        //si l'utilisateur fait une recherche on ne modifiera pas le contenu de la page
        return false;
    }*/
    console.log(index);
    console.log(publicationType);
    $.post("/home/update", {publicationIndex : index, publicationType : publicationType}, (data) => 
    {
        //s'il y a de nouvelles publications alors on les fait passer à VueJS qui met à jour dynamiquement le contenu de la page
        if(data.new_publications.length > 0)
        {
            console.log(data.new_publications);
            index += data.new_publications.length;
            publications.publications.unshift(data.new_publications);
        }
    });
}

function publishMessage(){
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
            }).done(function(){location.reload();});
        }
    })
}

function publicationButtonHover(){
    var textSaved = "";
    $(".unlike-publication, .unsub").mouseenter(function()
    {
        textSaved = $(this).html();
        $(this).removeClass("btn-primary").addClass("btn-danger");
        if($(this).hasClass("unsub"))
            $(this).html("Se désabonner");
        else if($(this).hasClass("unlike-publication"))
            $(this).html("Ne plus aimer la publication");  
    })

    $(".like-publication, .sub").mouseenter(function()
    {
        textSaved = $(this).html();
        $(this).removeClass("btn-primary").addClass("btn-success");
    })

    $(".unsub, .unlike-publication").mouseleave(function(){
        $(this).addClass("btn-primary").removeClass("btn-danger").html(textSaved);
    })

    $(".sub, .like-publication").mouseleave(function(){
        $(this).addClass("btn-primary").removeClass("btn-success").html(textSaved);
    })
}


function publicationButtonClick(){
    $(".unlike-publication").click( function() 
    {
        var buttonClicked = $(this);
        var publication_id = buttonClicked.data('publication');
        var number_likes = Number.parseInt(buttonClicked.children(".number-likes").html());
        $.post('/home/unlikepublication/', {publication_id : publication_id});
        buttonClicked.removeClass('unlike-publication').addClass('like-publication');
        buttonClicked.html('Aimer la publication (<span class="number-likes">' + (number_likes-1) + '</span>)');
    });

    $(".like-publication").click( function()
    {
        var buttonClicked = $(this);
        var publication_id = buttonClicked.data('publication');
        var number_likes = Number.parseInt(buttonClicked.children(".number-likes").html());
        $.post('/home/likepublication/', {publication_id : publication_id});
        buttonClicked.html('Publication aimée (<span class="number-likes">'+ (number_likes+1) + '</span>)');   
        buttonClicked.addClass('unlike-publication');
        buttonClicked.removeClass('like-publication');
    });

    $(".sub").click( function()
    {
        var buttonClicked = $(this);
        var author_id = buttonClicked.data('author_id');
        $.post('/home/subscribe/', {subscribe_to_id : author_id});
        buttonClicked.removeClass('sub').addClass('unsub');
        buttonClicked.html("Abonné(e)");
    });

    $(".unsub").click( function()
    {
        var buttonClicked = $(this);
        var author_id = buttonClicked.data('author_id');
        $.post('/home/unsubscribe/', {subscribe_to_id : author_id});
        buttonClicked.removeClass('unsub');
        buttonClicked.addClass('sub');
        buttonClicked.html("S'abonner");
    });
}

function changePublicationType(){
    $("#showAll, #showSubscriptions, #showMsgToMe, #showLiked").click(function()
    {
        var id = $(this).prop("id");
        var type = "";
        switch(id)
        {
            case "showAll":
                type = "all"
                break;
            case "showSubscriptions":
                type = "sub"
                break;
            case "showMsgToMe":
                type = "me"
                break;
            case "showLiked":
                type = "liked"
                break;
        }
        document.location = "/home/show?type="+type;
    })
}

function makeResearch(){
    $("#searchMsg").click(function()
    {
        var type = $(this).prop("id");
        var research = $("#searchPattern").val();
        if(research !== "")
        {
            $.post("/home/publicationtype", {type : type, searchFor : research}, (data) =>{
                location.reload();
            });
        }
    });
}

function hashtagClick(){
    $(".hashtag-clicked").click(function(e){
        e.preventDefault();
        console.log(this);
    });
}


function userNameClick(){
    $(".user-clicked").click(function(e){
        e.preventDefault();
        console.log(this);
    });
}