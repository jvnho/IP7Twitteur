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

app.set('view engine','ejs');

const pool = mysql.createPool(
{
    host: 'localhost',
    user: 'root',
    password: 'Nicola$32',
    database: 'projetsangsiri',
    connectionLimit : 10
});

app.get("/register", function(req, res){
    if(req.session.initialized)
        res.redirect('/home/');
    else 
        res.render("register.ejs");     
});

app.post("/register/existence", function(req, res){
    pool.query(req.body.query, function(err, rows, fields)
    {
        if(err) throw err
        if(rows.length > 0)
            res.send({existence : true}); //nom d'utilisateur ou email déjà existant
        else 
        res.send({existence : false}); //OK
    });
});

app.post("/register", function(req, res){
    var username = req.body.username;
    var password = md5(req.body.password);
    var email = req.body.email;
    var query = "INSERT INTO user(username,email,password) VALUES('"+username+"','"+email+"','"+password+"')";
    //faire une union de user sinon on redirect vers la page de login plutot
    pool.query(query, function(err,rows,fields)
    {
        if(err) throw err;
        logInUser(username,password)
        res.redirect('/home/');
    });
});

app.get("/register/*", function(req, res){
    res.redirect("/register/");
});

function logInUser(username, password){
    var query = "SELECT * FROM user WHERE username='"+username+"' AND password='"+password+"'";
    pool.query(query, function(err,rows,fieds)
    {
        if(err) throw err;
        if(rows.length > 0){
            req.session.initialized = true;
            req.session.username = rows[0].username;
            req.session.user_id = parseInt(rows[0].user_id);
            return true;
        } else {
            return false;
        }
    });
}

app.get("/login", function(req, res){
    if(req.session.initialized)
        res.redirect('/home/');
    else 
        res.render("login.ejs");  
});

app.post("/login", function(req, res){
    var login = req.body.username;
    var password = md5(req.body.password);
    if(logInUser(login,password) == true){
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

app.get("/login/*", function(req, res){
    res.redirect('/login/');
});

app.get("/home", function(req, res){
    //res.render("home.ejs");
    res.redirect("/register/");
});

app.get("/home/*", function(req, res){
    res.redirect("/home/");
});


app.get("/", function(req,res){
    res.redirect("/home/");
});

app.get("*", function(req,res){
    res.redirect("/home/");
});

app.listen(8080);