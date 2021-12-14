const express = require("express");
const app = express();
const PORT = 8080;
const bcrypt = require('bcryptjs');
const password = "purple-monkey-dinosaur"; // found in the req.params object
const hashedPassword = bcrypt.hashSync(password, 10);


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
};
  
const bodyParser = require("body-parser");
const cookiesession = require("cookie-session");
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookiesession({
name: 'session',
keys: ["Key1", "Key2"],
}));
app.set("view engine", "ejs");

const getUserEmail = (email) => {
  console.log("test1" ,email)
  for (const T in users) {
    console.log((`${T}: ${users[T].email}`));
    if (users[T].email === email) {
      return users[T];
        
    } 
  }
  return false
};
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
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
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
  console.log(req.session.user_Id);
  let user = getUserEmail(req.session.user_Id);
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
  const userId = req.session.user_Id;
  const user = users[userId];
  const templateVars = {
    user,
    urls: urlDatabase
  };
  res.render("urls_new", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls");
});


app.post("/register", function(req, res) {
  let email = req.body.email;
  let pass = req.body.pass;

  if (!email || email === "" && !pass || pass === "")
    res.status(400).send("Fields Cannot be Empty");
  else {

    let match = false;
    for (let i in users) {

      if (users[i].email === email)
        match = true;
    }

    if (match)
      res.status(400).send("User already exists");
    else {
      let password = bcrypt.hashSync(pass,10);
      let id = generateRandomString();
      users[id] = {id: id,
                  email: email,
                  password: password};

      // urlDatabase[id] = {};

      req.session.user_Id = id;
      // console.log(users)
      res.redirect("/urls");
    }
  }
});

app.post("/login", (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  const user = getUserEmail(email);
  console.log("test",user)
  if (!user) {
    return res
      .status(401)
      .send(
        "Issue with email or password. Please <a href= '/login'>try again</a>"
      );
  }
  // runs when authentication fails
  console.log("ready" ,password, user.password)
  if (!bcrypt.compareSync(password, user.password)) {
    console.log(user[password]);
    return res
      .status(401)
      .send(
        "Issue with email or password. Please <a href= '/login'>try again</a>"
      );
  }

  console.log(user);

  req.session.user_Id = user.id;
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const userID = req.session["user_Id"];
  let shortURL = req.params.shortURL;
  if (userID === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
  
    res.redirect("/urls");
  } else if (userID) {
    res.status(403).send("You are not the owner of this shortURL");
  } else {
    res.status(401).send("Please <a href= '/login'>login</a>");
  }
});

app.get("/login", (req, res) => {
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
