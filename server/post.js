const mongoose = require('mongoose')

const Post = new mongoose.Schema({
    message: {type:String, trim: true, default:''},
    user: {type:String, trim: true, default:''},
    votes: {type:Number, trim:true, default:0},
    voters: {type:Array, trim:true, default:[]}
})

module.exports = mongoose.model('Post', Post)