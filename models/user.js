const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/travelling")
.then(function( ) {
    console.log(" Database connected");
})
.catch(function (err) {
    console.log(err);
})

const userSchema = mongoose.Schema ({
    fullname: String,    
    email: String,
    password: String,


})

module.exports = mongoose.model("user", userSchema);