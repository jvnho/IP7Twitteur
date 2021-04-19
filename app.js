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
    res.render("register.ejs");
});

app.post("/register/existence", function(req, res){
    pool.query(req.body.query, function(err, rows, fields)
    {
        if(err) throw err
        if(rows.length > 0)
            res.send({existence : true}); //nom dutilisateur ou email déjà existant
        else 
        res.send({existence : false}); //OK
    });
});

app.post("/register", function(req, res){
    
});

app.get("/register/*", function(req, res){
    res.redirect("/register/");
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