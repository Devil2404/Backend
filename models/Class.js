const mongoose = require('mongoose');
const { Schema } = mongoose;
const ClassSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    teachers: {
        type: Array
    },
    students: {
        type: Array
    }
})
module.exports = mongoose.model('Class', ClassSchema);