const mongoose = require('mongoose');
const { Schema } = mongoose;
const StudentsSchema = new Schema({
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'

    },
    rollno: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    score: {
        type: Array,
        // required: true
    },
    percantage: {
        type: Array
    }

})
module.exports = mongoose.model('Students', StudentsSchema);