const mongoose = require('mongoose');
const { Schema } = mongoose;
const TeacherSchema = new Schema({
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }

})
module.exports = mongoose.model('Teacher', TeacherSchema);