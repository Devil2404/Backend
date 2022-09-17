const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://shahpreet24:Shahbad7@cluster0.syocf.mongodb.net/Internship'

const connectToMongoo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("You are now connected succefully");
    })
}
module.exports = connectToMongoo;