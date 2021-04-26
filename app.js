const express = require('express');
const session = require('express-session');
const ejs = require("ejs");
const path = require("path");
const mysql = require('mysql');
const md5 = require('md5');
//const bodyParser = require('body-parser')

const app = express();

app.use(express.urlencoded({extended:false}));
app.use(session({secret: 'lalalala', saveUninitialized: true, resave: true}));

app.use("/", express.static(__dirname));
app.use("/", express.static(__dirname + '/views/'));
app.use("/", express.static(__dirname + '/public/'));

app.set('view engine','ejs');

const pool = mysql.createPool(
{
    host: 'localhost',
    user: 'root',
    password: 'Nicola$32',
    database: 'projetsangsiri',
    multipleStatements: true,
    connectionLimit : 10
});

app.get("/register", (req, res) =>{
    if(req.session.initialized)
        res.redirect('/home/');
    else 
        res.render("register.ejs");     
});

app.post("/register/existence", (req, res) => {
    pool.query(req.body.query, (err, rows, fields) => 
    {
        if(err) throw err
        if(rows.length > 0)
            res.send({existence : true}); //nom d'utilisateur ou email déjà existant
        else 
            res.send({existence : false}); //OK
    });
});

app.post("/register", (req, res) => {
    var username = req.body.username;
    var password = md5(req.body.password);
    var email = req.body.email;
    var query = "INSERT INTO user(username,email,password) VALUES('"+username+"','"+email+"','"+password+"');";
    //faire une union de user sinon on redirect vers la page de login plutot
    pool.query(query, (err,rows,fields) => 
    {
        if(err) throw err;
        //logInUser(req, username,password)
        res.sendStatus(200);
    });
});

app.get("/register/*", (req, res) => {
    res.redirect("/register/");
});

app.get("/login/", (req, res) => {
    if(req.session.initialized)
        res.redirect('/home/');
    else 
        res.render("login.ejs");  
});

app.post("/login/", (req, res) => {
    var username = req.body.username;
    var password = md5(req.body.password);
    var query = "SELECT * FROM user WHERE username='"+username+"' AND password='"+password+"';";
    pool.query(query, (err,rows,fieds) =>
    {
        if(err) throw err;
        if(rows.length > 0){
            req.session.initialized = true;
            req.session.username = rows[0].username;
            req.session.user_id = parseInt(rows[0].user_id);
            req.session.publicationType = "everyone"; //everyone || subscribed || mentionned || liked
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    });
});

app.get("/login/*", (req, res) => {
    res.redirect('/login/');
});

app.get("/home", (req, res) => {
    var publications = [];
    var query = '';
    if(req.session.initialized !== true){
        query = `
            SELECT * FROM publication as p, user as u WHERE p.author_id = u.user_id;
            `;
    } else {
        switch(req.session.publicationType)
        {
            case "everyone":    
                query = `
                SELECT * FROM publication as p, user as u WHERE p.at_everyone = false AND p.author_id = u.user_id
                `;
                break;
            case "subscribed":   
                query = `
                SELECT * FROM publication as pub, user_subscription as sub, user as u 
                WHERE sub.user_id = `+ req.session.user_id +`
                AND sub.subscribe_to = pub.author_id
                AND pub.author_id = u.user_id
                `;
                break;
            case "mentionned":    
                query = `
                SELECT * FROM publication as pub, publication_mention as mention, user as u 
                WHERE mention.user_mentionned = `+ req.session.user_id +`
                AND pub.publication_id = mention.publication_id
                AND pub.author_id = u.user_id
                `;
                break;
            case "liked":  
                query = `
                SELECT * FROM publication as pub, publication_reaction as react, user as u 
                WHERE react.liked = true 
                AND react.reactor_id = `+ req.session.user_id +`
                AND pub.publication_id = react.publication_id
                AND pub.author_id = u.user_id
                `;
                break;
            default:
                query = `
                SELECT * FROM publication as p, user as u WHERE p.author_id = u.user_id
                `;
                break;
        }
    }
    pool.query(query, (err,rows,fields) => {
        res.render("home.ejs", {publications : rows, connectionStatus : (req.session.initialized ? true : false)});
    });
});

app.post("/home/publish/", (req,res) => {
    if(!req.session.initialized){
        res.redirect('/home/');
    } else {
        var query = "INSERT INTO publication(author_id,date,content) VALUES(?,NOW(),?)";
        pool.query(query, [req.session.user_id, req.body.content], (err, rows, fields) =>{
            if(err) throw err;
        });
    }
});

app.get("/home/*", (req, res) => {
    res.redirect("/home/");
});

app.get("/logout/", (req, res) =>{
    req.session.destroy();
    res.redirect('/home/');
});


app.get("/", (req,res) => {
    res.redirect("/home/");
});

app.get("*", (req,res) => {
    res.redirect("/home/");
});

app.listen(8080);