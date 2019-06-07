var express = require("express");
var cookieParser = require('cookie-parser')
var app = express();
app.use(cookieParser())

var PORT = 8080; // default port 8080

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

function generateRandomString() {
  return Math.random().toString(36).substr(6) ;
}

function checkEmail(email){
  for (var userId in users){
    var user = users[userId]
    if (email === user.email){
      return true;
    }
  }
  return false;
}

app.set('view engine', 'ejs');

var urlDatabase = {
  // "b2xVn2": "http://www.lighthouselabs.ca",
  // "9sm5xK": "http://www.google.com",
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

  app.get("/register", (req, res) => {
    let templateVars = {
      username: req.cookies["username"],
      password: req.cookies["password"]
    }
    res.render("urls_register", templateVars);
  });

  app.get("/login", (req, res) => {
    let templateVars = {
      username: req.cookies["username"],
      password: req.cookies["password"]
    }
    res.render("urls_login", templateVars);
  });

  app.get("/urls", (req, res) => {
    let user_id = req.cookies["user_id"];
    let user = users[user_id];
    let templateVars = { 
      email: user.email,
      urls: urlDatabase 
    };
    res.render("urls_index", templateVars);
  });

  app.get("/urls/new", (req, res) => {
    let user_id = req.cookies["user_id"];
    let user = users[user_id];
    let templateVars = {
      username: req.cookies["user_id"],
      email: user.email
    }
    res.render("urls_new", templateVars);
  });

  app.get("/urls/:shortURL", (req, res) => {
    let templateVars = { shortURL: req.params.shortURL, 
                        longURL: urlDatabase[req.params.shortURL],
                        username: req.cookies["userId"]
                        };
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
    console.log(req.params.shortURL, urlDatabase)
    const shortURL = req.params.shortURL;
    delete urlDatabase[shortURL];
    res.redirect("/urls/");         // Respond with 'Ok' (we will replace this)
  });

  app.post("/login", (req, res) => {
    res.cookie("username", req.body.username);
    res.redirect("/urls/");
  })

  app.post("/logout", (req, res) => {
    res.clearCookie("users", req.body.username);
    res.redirect("/urls/");
  })

  app.post("/register", (req, res) => {
    console.log(req.body)
    if (req.body.email === "" || req.body.password === ""){
      res.status(404).send('NO EMAIL OR PASSWORD REGISTERED');
    }
    else if (checkEmail(req.body.email)){
      res.status(404).send("EMAIL ALREADY EXISTS");
    } else {
    const user_id = generateRandomString();
    users[user_id] = {id: user_id, email: req.body.email, password: req.body.password};
    res.cookie("user_id", user_id);
    res.redirect("/urls/");
    }
  })

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});