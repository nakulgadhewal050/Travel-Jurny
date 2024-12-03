const express = require('express')
const app = express()
const port = 3000
const userModel = require("./models/user");
const bookingModel = require("./models/booking");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Booking = require("./models/booking");
const session = require("express-session");

app.set("view engine", "ejs");

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: "shhh", 
    resave: false,
    saveUninitialized: true,
  })
);

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

app.get("/home", isLoggedIn, async (req, res) => {
  
  res.render("home", { user: req.user }); // Pass user data to the template
});



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

req.session.userEmail = req.body.email; // Assume email is sent in the request body



});

//logedin funtion

function isLoggedIn(req, res, next) {
  try {
      if (!req.cookies.token || req.cookies.token === "") {
          return res.render("login");
      }
      
      const data = jwt.verify(req.cookies.token, "shhh");
      req.user = data;
      next();
  } catch (err) {
      return res.send("Invalid or expired token");
  }
  //  if (req.session && req.session.userEmail) {
  //   req.user = { email: req.session.userEmail }; 
  //   return next();
  // }
  // res.redirect("/login");
}

  // navbar
  app.get('/about',isLoggedIn, (req, res) => {
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

app.get("/mountain",isLoggedIn, function(req,res) {
  res.render("mountain")
})

//first
app.get("/mountain-first", (req,res) => {
  res.render("mountain-first")
})

app.get("/kanchenjungha", (req,res) => {
  res.render("kanchenjungha")
})

app.get("/MachuPicchu", (req,res) => {
  res.render("MachuPicchu")
})
  
app.get("/YosemiteNationalPark", (req,res) => {
  res.render("YosemiteNationalPark")
})

app.get("/MountAbu", (req,res) => {
  res.render("MountAbu")
})

app.get("/PoonHillNepal", (req,res) => {
  res.render("PoonHillNepal")
})

//-----------------------------------------------------------------//

app.get("/religious", (req,res) => {
  res.render("religious")
})
//first
app.get("/Ayodhya", (req,res) => {
  res.render("religious-first")
})

app.get("/Ujjain", (req,res) => {
  res.render("religious-second")
})

app.get("/Badrinath", (req,res) => {
  res.render("religious-third")
})

app.get("/VaishnoDevi", (req,res) => {
  res.render("religious-forth")
})

app.get("/KashiVishwanath", (req,res) => {
  res.render("religious-fifth")
})

app.get("/Jagannath", (req,res) => {
  res.render("religious-sixth")
})

//-------------------------------------------------------------------//
app.get("/hills", (req,res) => {
  res.render("hillsStation")
})

app.get("/Mussoorie", (req,res) => {
  res.render("hills-first")
})

app.get("/McLeodGanj", (req,res) => {
  res.render("hills-second")
})

app.get("/Ladakh", (req,res) => {
  res.render("hills-third")
})

app.get("/Shillong", (req,res) => {
  res.render("hills-fourth")
})

app.get("/Nainital", (req,res) => {
  res.render("hills-fifth")
})

app.get("/Kullu", (req,res) => {
  res.render("hills-sixth")
})

//-----------------------------------------------------------------------//

app.get("/beaches", (req,res) => {
  res.render("beaches")
})

//first

app.get("/Goa", (req,res) => {
  res.render("Goa-first")
}) 

app.get("/Pondicherry", (req,res) => {
  res.render("Pondicherry-second")
})

app.get("/Phuket", (req,res) => {
  res.render("Phuket-third")
})

app.get("/Bali", (req,res) => {
  res.render("Bali-fourth")
})

app.get("/Lakshadweep", (req,res) => {
  res.render("Lakshadweep-fifth")
})

app.get("/Andaman", (req,res) => {
  res.render("Andaman-sixth")
})

//popular destination

app.get("/Maldive", (req,res) => {
  res.render("Maldive-first")
}) 

app.get("/Agra", (req,res) => {
  res.render("Agra-second")
})

app.get("/Varanasi", (req,res) => {
  res.render("Varanasi-third")
})

app.get("/Kashmir", (req,res) => {
  res.render("Kashmir-fourth")
})

app.get("/Shimla", (req,res) => {
  res.render("Shimla-fifth")
})

app.get("/Badrinath", (req,res) => {
  res.render("Badrinath-sixth")
})


//International destination

app.get("/Singapore", (req,res) => {
  res.render("Singapore-first")
}) 

app.get("/Dubai", (req,res) => {
  res.render("Dubai-second")
})

app.get("/London", (req,res) => {
  res.render("London-third")
})

app.get("/Malaysia", (req,res) => {
  res.render("Malaysia-fourth")
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


app.post("/success", (req,res) => {
  res.render("success")
})


//----------------profile--------------------------------//



app.get("/profile", async (req, res) => {
  try {
    const bookings = await Booking.find(); // Fetch data from the database
    res.render("profile", { bookings });  // Pass data to the HTML
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching bookings");
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})