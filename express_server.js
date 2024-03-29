var express = require("express");
var cookieParser = require('cookie-parser')
var app = express();
app.use(cookieParser())

var PORT = 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

function generateRandomString() {
  return Math.random().toString(36).substr(6) ;
}

app.set('view engine', 'ejs');

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });

  app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
  });

  app.get("/urls", (req, res) => {
    let templateVars = { 
      username: req.cookies["username"],
      urls: urlDatabase };
    res.render("urls_index", templateVars);
  });

  app.get("/urls/new", (req, res) => {
    let templateVars = {
    username: req.cookies["username"]}
    res.render("urls_new", templateVars);
  });

  app.get("/urls/:shortURL", (req, res) => {
    let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
    res.render("urls_show", templateVars);
  });

  app.get("/u/:shortURL", (req, res) => {
    const longURL = urlDatabase[req.params.shortURL];
    console.log(longURL)
    res.redirect(longURL);
  });
  
  app.post("/urls", (req, res) => {
    //console.log(req.body);  // Log the POST request body to the console
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = req.body.longURL
    res.redirect("/urls/" + shortURL);         // Respond with 'Ok' (we will replace this)
  });

  app.post("/urls/:shortURL/update", (req, res) =>{
    urlDatabase[req.params.shortURL] = req.body.longURL 
    res.redirect("/urls/");
  })

  app.post("/urls/:shortURL/delete", (req, res) => {
    const shortURL = req.params.shortURL;
    delete shortURL;
    res.redirect("/urls/");         // Respond with 'Ok' (we will replace this)
  });

  app.post("/login", (req, res) => {
    res.cookie("username", req.body.username);
    res.redirect("/urls/");
  })

  app.post("/logout", (req, res) => {
    res.clearCookie("username", req.body.username);
    res.redirect("/urls/");
  })

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});