const express = require('express')
const app = express()
const port = 3000
const userModel = require("./models/user");
const bookingModel = require("./models/booking");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

app.set("view engine", "ejs");

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get('/', (req, res) => {
  res.render("index")
})

app.get('/signup', (req, res) => {
  res.render("signup")
});


app.get("/login", (req, res) => {
    res.render("login")
});


//home page

app.get("/home", isLoggedIn, async function (req,res) {
  res.render('home', { user: req.user });
  
})



// singup route

app.post("/rgistered", async(req, res) => {
  
  try {
    let { email, fullname, password } = req.body;

    bcrypt.genSalt(10 , function(err,salt) {
      bcrypt.hash(password, salt, async function(err,hash){
        if (err) return res.send(err.message);
        else {

  const user = await userModel.create({
    fullname,
    email,
    password: hash,
  })

  

  let token =  jwt.sign({email: email, userid: user._id}, 'shhh');
  res.cookie("token", token);
  res.render("login")
        }
      })
    });
    
   } catch (err) {
    res.send(err.message)
  }
 
});

//login route

app.post("/login", async(req, res) => {
  const { email, password} = req.body;
  

const user =  await userModel.findOne({ email});

if(!user) return res.status(500).send("something went wrong");

bcrypt.compare(password, user.password, function(err, result){
  if(result) {
      let token =  jwt.sign({email: email, userid: user._id}, 'shhh');
      res.cookie("token", token);
      res.status(200).redirect("home")
  }
      else res.redirect("/login")
})


});

//logedin funtion

function isLoggedIn(req, res, next){
  if(req.cookies.token === "") res.send("you must be logged in");
  else {
      let data = jwt.verify(req.cookies.token, "shhh");

      req.user = data;

      next();
  }
  }

  // navbar
  app.get('/about', (req, res) => {
    res.render("about")
  })

  app.get('/destination', (req, res) => {
    res.render("destination")
  })

  
  app.get('/contact', (req, res) => {
    res.render("contact")
  })

  // Explore 

// 1) mountain

app.get("/mountain", function(req,res) {
  res.render("mountain")
})

//first
app.get("/mountain-first", (req,res) => {
  res.render("mountain-first")
})
  
app.get("/religious", (req,res) => {
  res.render("religious")
})
//first
app.get("/religious-first", (req,res) => {
  res.render("religious-first")
})

app.get("/hills", (req,res) => {
  res.render("hillsStation")
})

app.get("/beaches", (req,res) => {
  res.render("beaches")
})

//booking

app.get("/booking", (req,res) => {
  res.render("booking")
})


app.post("/booking", async function(req, res) {
  let { email, fullname, phone, people, date, upi } = req.body;
  try {
      const book = await bookingModel.create({
          fullname,
          email,
          date: new Date(date), // Convert string to Date
          people,
          phone,
          upi,
      });
      res.render("payment")
  } catch (error) {
      console.error(error);
      res.status(400).send("Failed to book. Please check your input.");
  }
});

app.get("/payment", (req,res) => {
  res.render("payment")
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})