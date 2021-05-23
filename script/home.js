function getMaxIndex(array){
    var max = 0;
    for(var i = 0; i < array.length; i++){
        if(array[i].publication_id > max)
            max = array[i].publication_id;
    }
    return max;
}

//source : https://html-online.com/articles/get-url-parameters-javascript/
function getUrlVars(){
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

var index = getMaxIndex(publications);

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
        <div :data-author_id="publication.author_id" class="publication media border p-4 mt-5">
            <img v-bind:src="'../img/'+publication.picture" alt="" class="mr-3 mt-3 rounded-circle" style="width:125px;">
            <div class="media-body">
                <h4>
                    {{publication.username}} 
                    <small>
                        <i>{{publication.date.slice(0,10) + " " + publication.date.slice(11,16)}}</i>
                    </small>
                    <div v-if="this.connected && this.user_id !== publication.author_id" class="d-inline align-items-end">
                    
                        <button :data-publication="publication.publication_id" v-if="publication.liked" type="button" class="btn btn-outline-dark btn-sm unlike-publication">
                        <i class="bi bi-hand-thumbs-up-fill"></i><span class="number-likes">{{publication.nbr_like}}</span>
                        </button>

                        <button :data-publication="publication.publication_id" v-else type="button" class="btn btn-outline-dark btn-sm like-publication">
                        <i class="bi bi-hand-thumbs-up"></i><span class="number-likes">{{publication.nbr_like}}</span>
                        </button>

                        <button :data-author_id="publication.author_id" v-if="publication.subscribed == 0" type="button" class="btn btn-outline-dark btn-sm subscription sub">
                            S'abonner
                        </button>

                        <button :data-author_id="publication.author_id" v-else type="button" class="btn btn-outline-dark btn-sm subscription unsub">
                            Se désabonner
                        </button>
                    </div>
                    <div v-else class="d-inline">
                        <small><i class="bi bi-hand-thumbs-up"></i>{{publication.nbr_like}}</small>
                    </div>
                </h4>
                <p v-html="addLink(publication.content)"></p>
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
    },
    methods: {
        shiftPublicationArray(array){
            for(var i = array.length-1; i >= 0; i--){
                this.publications.unshift(array[i]);
            }
        }
    }
})

$(document).ready(function(){
    initSearchBar();
    initButtonType();
    publishMessage();
    publicationButtonHover();
    publicationButtonClick();
    changePublicationType();
    makeResearch();
    hashtagClick();
    userNameClick();

    
    setInterval(updatePublications, 5000);
});

function initSearchBar(){
    var getParams = getUrlVars();
    var decodedURI = (typeof(getParams.for) !== "undefined" && getParams.for !== "" ? decodeURI(getParams.for) : ""); 
    $("#searchPattern").val(decodedURI);
}

function initButtonType(){
    var getParams = getUrlVars();
    if(typeof getParams.type === "undefined"){
        $("#showAll").addClass("active");
    } else {
        switch(getParams.type){
            case "all":
                $("#showAll").addClass("active");
                break;
            case "mine":
                $("#showMine").addClass("active");
                break;
            case "sub":
                $("#showSubscriptions").addClass("active");
                break;
            case "me":
                $("#showMsgToMe").addClass("active");
                break;
            case "liked":
                $("#showLiked").addClass("active");
                break;
        }
    }
}

function updatePublications(){
    if(publicationType === "search" || publicationType === "liked" || publicationType === "mine"){
        //si l'utilisateur fait une recherche on ne modifiera pas le contenu de la page
        //aucun intérêt à rafraîchir ces pages
        return false;
    }
    $.post("/home/update", {publicationIndex : index, publicationType : publicationType}, (data) => 
    {
        //s'il y a de nouvelles publications alors on les fait passer à VueJS qui met à jour dynamiquement le contenu de la page
        if(data.new_publications.length > 0)
        {
            index = getMaxIndex(data.new_publications);
            publications.shiftPublicationArray(data.new_publications);
        }
    });
}

function publishMessage(){
    $("#publish-message").click(function(event){
        $(this).prop("disabled", true);
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
            }).done(function(){location.href = '/home/show?type=mine';});
        }
        $(this).prop("disabled", false);
    })
}

function publicationButtonHover(){
   
    $("body").on('mouseenter', ".unlike-publication, .unsub", function()
    {
        $(this).removeClass("btn-outline-dark").addClass("btn-outline-danger");
    });

    $("body").on('mouseleave', ".unlike-publication, .unsub", function(){
        $(this).addClass("btn-outline-dark").removeClass("btn-outline-danger");
    })

    $("body").on("mouseenter", ".like-publication, .sub", function()
    {
        $(this).removeClass("btn-outline-dark").addClass("btn-outline-success");
    })

    $("body").on("mouseleave",".like-publication, .sub", function(){
        $(this).addClass("btn-outline-dark").removeClass("btn-outline-success");
    })
}


function publicationButtonClick(){
    $("body").on("click", ".unlike-publication", function(e) 
    {
        e.preventDefault();
        var buttonClicked = $(this);
        buttonClicked.prop("disabled", true);
        var publication_id = buttonClicked.data('publication');
        var number_likes = (Number.parseInt(buttonClicked.children(".number-likes").html())) - 1;
        $.post('/home/unlikepublication/', {publication_id : publication_id}, function(data)
        {
            buttonClicked.html('<i class="bi bi-hand-thumbs-up"></i><span class="number-likes">' + number_likes + '</span>');
            buttonClicked.removeClass('unlike-publication btn-outline-danger').addClass('like-publication btn-outline-success');
            buttonClicked.prop("disabled", false);
        });
    });

    $("body").on("click",".like-publication", function(e)
    {
        e.preventDefault();
        var buttonClicked = $(this);
        buttonClicked.prop("disabled", true);
        var publication_id = buttonClicked.data('publication');
        var number_likes = (Number.parseInt(buttonClicked.children(".number-likes").html())) + 1;
        $.post('/home/likepublication/', {publication_id : publication_id}, function(data)
        {
            buttonClicked.html('<i class="bi bi-hand-thumbs-up-fill"></i><span class="number-likes">'+ number_likes + '</span>');   
            buttonClicked.addClass('unlike-publication btn-outline-danger').removeClass('like-publication btn-outline-success');
            buttonClicked.prop("disabled", false);
        });
    });

    $("body").on("click", ".sub", function(e)
    {
        e.preventDefault();
        var buttonClicked = $(this);
        buttonClicked.prop("disabled", true);
        var author_id = buttonClicked.data('author_id');
        $.post('/home/subscribe/', {subscribe_to_id : author_id}, function(data)
        {
            buttonClicked.html("Se désabonner");
            buttonClicked.removeClass('btn-outline-success').addClass('btn-outline-danger');
            buttonClicked.prop("disabled", false);
            setBtnToUnSub(author_id);
        });

    });

    $("body").on("click", ".unsub", function(e)
    {
        e.preventDefault();
        var buttonClicked = $(this);
        buttonClicked.prop("disabled", true);
        var author_id = buttonClicked.data('author_id');
        $.post('/home/unsubscribe/', {subscribe_to_id : author_id}, function(data)
        {
            buttonClicked.html("S'abonner");
            buttonClicked.removeClass('unsub btn-outline-danger').addClass('sub btn-outline-dark');
            buttonClicked.prop("disabled", false);
            setBtnToSub(author_id);
        });
    });
}

//fonction met à jour le bouton s'abonner des publications quand un utilisateur s'abonne à un autre
function setBtnToUnSub(author_id){
    $(".publication").each(function()
    {
        if(Number.parseInt($(this).data("author_id")) == author_id)
        {
            $(this).children(".media-body")
            .children("h4")
            .children("div")
            .children(".subscription")
            .addClass("unsub")
            .removeClass("sub")
            .html("Se désabonner");
        }
    })
}

//fonction met à jour le bouton s'abonner des publications quand un utilisateur se désabonne à un autre
function setBtnToSub(author_id){
    $(".publication").each(function()
    {
        if(Number.parseInt($(this).data("author_id")) == author_id)
        {
            $(this).children(".media-body")
            .children("h4")
            .children("div")
            .children(".subscription")
            .addClass("sub")
            .removeClass("unsub")
            .html("S'abonner");
        }
    })
}

function changePublicationType(){
    $("#showAll, #showMine, #showSubscriptions, #showMsgToMe, #showLiked").click(function()
    {
        var id = $(this).prop("id");
        var type = "";
        switch(id)
        {
            case "showAll":
                type = "all"
                break;
            case "showMine":
                type = "mine"
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
        $(this).prop("disabled", true);
        var research = $("#searchPattern").val();
        if(research !== "")
        {
            document.location = "/home/show?type=search&for="+encodeURI(research);
        }
        $(this).prop("disabled", false);
    });
}

function hashtagClick(){
    $(".hashtag-clicked").click(function(e){
        $(this).prop("disabled", true);
        e.preventDefault();
        var research = $(this).children("kbd").html().replace("#","");
        document.location = "/home/show?type=search&for="+encodeURI(research);
    });
}


function userNameClick(){
    $(".user-clicked").click(function(e){
        $(this).prop("disabled", true);
        e.preventDefault();
        var research = $(this).children("kbd").html().replace("@","");
        document.location = "/home/show?type=search&for="+encodeURI(research);
    });
}