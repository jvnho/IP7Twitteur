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
    getPublications(0, req, function(err, rows){
        if(err) throw err;
        res.render("home.ejs", {publications : rows, connectionStatus : (req.session.initialized ? true : false), userID : (typeof req.session.user_id !== "undefined" ? req.session.user_id : -1)});
    });   
});

const myQuery = require('./script/query.js');

function getPublications(index, req, callback){
    var query = myQuery.getQuery(req.session.publicationType, index, req.session.user_id);
    pool.query(query, (err,rows,fields) => {
        callback(err,rows);
    });
}

app.post("/home/update", (req,res) => {
    getPublications(req.body.publication_index, req, function(err, rows){
        if(err) throw err;
        res.send( {new_publications : rows} );
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

app.post("/home/likepublication/", (req,res) =>{
    var publication_id = req.body.publication_id;
    pool.query("INSERT INTO publication_reaction VALUES (?,?,true)", [publication_id, req.session.user_id], (err,rows,fields) =>{
        if(err) throw err;
        res.sendStatus(200);
    });
});

app.post("/home/unlikepublication/", (req,res) =>{
    var publication_id = req.body.publication_id;
    pool.query("DELETE FROM publication_reaction WHERE publication_id = ? AND reactor_id = ?", [publication_id, req.session.user_id], (err,rows,fields) =>{
        if(err) throw err;
        res.sendStatus(200);
    });
});

app.post("/home/subscribe/", (req,res) =>{
    var subscribe_to_id = req.body.subscribe_to_id;
    pool.query("INSERT INTO user_subscription VALUES (?,?)", [req.session.user_id, subscribe_to_id], (err,rows,fields) =>{
        if(err) throw err;
        res.sendStatus(200);
    });
});

app.post("/home/unsubscribe/", (req,res) =>{
    var subscribe_to_id = req.body.subscribe_to_id;
    pool.query("DELETE FROM user_subscription WHERE user_id = ? AND subscribe_to = ?", [req.session.user_id, subscribe_to_id], (err,rows,fields) =>{
        if(err) throw err;
        res.sendStatus(200);
    });
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