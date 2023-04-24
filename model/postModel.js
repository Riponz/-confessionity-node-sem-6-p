const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
    },
    userid:{
        type:String,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now,
        required: true,
    },
    content:{
        type: String,
        required: true,
    },
    comments:[String],
})

module.exports = mongoose.model('post', postSchema)