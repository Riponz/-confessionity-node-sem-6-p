const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    userid:{
        type: String,
        required: true,
    },
    pass:{
        type: String,
        required: true
    },
})

module.exports = mongoose.model('users', userSchema)