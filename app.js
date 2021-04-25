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
    if(req.session.initialized == false){
        query = `
            SELECT * FROM publication as p, user as u WHERE p.at_everyone = false AND p.author_id = u.user_id;
            SELECT publication_id, count(*) as nbr_like FROM publication_reaction WHERE liked = true GROUP BY publication_id`;
    } else {
        switch(req.session.publicationType){
            case "everyone":    
                query = `
                SELECT * FROM publication as p, user as u WHERE p.at_everyone = false AND p.author_id = u.user_id;
                SELECT publication_id, count(*) as nbr_like FROM publication_reaction WHERE liked = true GROUP BY publication_id`;
                break;
            case "subscribed":   
                query = ``; 
                break;
            case "mentionned":    
                query = ``;
                break;
            case "liked":  
                query = ``;  
                break;
        }
    }
    //const result = await pool.query(query);
    res.render("home.ejs", {publication : publication, connectionStatus : (req.session.initialized ? true : false)});
    //pool.query(query, (req,res) => { });
});

app.post("/home/publish/", (req,res) => {
    if(!req.session.initialized){
        res.redirect('/home/');
    } else {
        var query = "INSERT INTO publication(author_id,date,content) VALUES(?,NOW(),?)";
        pool.query(query, [req.session.user_id, req.body.content], (err, rows, fields) =>{
            if(err) throw err;
            console.log("ok");
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