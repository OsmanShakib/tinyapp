const express = require("express");
const app = express();
const PORT = 8080;

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
const cookieParser = require("cookie-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser())
app.set("view engine", "ejs");

const getUserEmail = (user_id) => {
    for (const T in users ) {
     console.log((`${T}: ${users[T].email}`)); 
     if (user_id === T){
         return users[T].email 
        
     } else {
         return false
     }
    }
} 
function generateRandomString() {
  let result           = '';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charlength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charlength));
  }
  return result;
}
const urlDatabase = {
  "b2xVn2": "http:www.lighthouselabs.ca",
  "9sm5xK": "http:www.google.com"
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
    console.log(req.cookies.user_id)
    let user = getUserEmail(req.cookies.user_id)
  const templateVars = { 
      urls: urlDatabase,
     user ,
    };
  res.render("urls_index", templateVars);
});
  

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/u/:shortURL", (req, res) => {
    const longURL = urlDatabase[req.params.shortURL];
    res.redirect(longURL);
});

app.post("/urls", (req, res) => {
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = req.body.longURL;
    res.redirect(`urls/${shortURL}`);
});

app.get("/urls/new", (req, res) => {
    const templateVars = {
        user: {}
    };
  res.render("urls_new", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
    let shortURL = req.params.shortURL;
    urlDatabase[shortURL] = req.body.longURL
    res.redirect("/urls")
})


app.post("/register", function(req, res) {
    let email = req.body.email;
    let password = req.body.pass;
  
    if (!email || email === "" && !password || password == "")
    { res.sendStatus(400);
    }
    else
    {
      let match = false;
      for (let i in users)
      {
        if (users[i].email === email)
          match = true;
      }
        if (match)
        res.sendStatus(400);
  
      let id = generateRandomString();
      console.log(`${email}     ${password}`);
      users[id] = {id: id,
                  email: email,
                  password: password};
  
      res.cookie("user_id", id);
      res.redirect("/urls");
    }
  });

  app.post("/login", function(request, response) {
    let name = request.body.username;
    let pass = request.body.password;
    console.log()
    if (!name || name === "" && !pass || pass == "")
    {
      response.status(400).send("Fields Cannot be Empty");
    }
    else
    {
      for (let i in users)
      {
        if (users[i].email === name)
          if (users[i].password === pass)
          {
            response.cookie('user_id', i);
            response.redirect("/urls");
          }
      }
      response.status(400).send("Login or password is incorrect!");
  
  
  
    }
  });
app.post("/logout", (req, res) => {
    res.clearCookie("username");
    res.redirect('/urls');
  })

  app.post("/urls/:shortURL/delete", (req, res) => {
let shortURL = req.params.shortURL;
delete urlDatabase[shortURL]
res.redirect("/urls")

})

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  let templateVars = { shortURL, longURL: urlDatabase[shortURL],user:""};
  res.render("urls_show", templateVars);
});
  
 app.get("/urls/new", (req, res) => {
   res.render("urls_new");
 });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
