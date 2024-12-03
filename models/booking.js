
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/travelling");


const bookingSchema = mongoose.Schema({
    fullname: String, 
    email: String,
    phone: Number,
    date: Date, 
    people: Number,
    
});

module.exports = mongoose.model("booking", bookingSchema);