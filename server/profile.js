const mongoose = require('mongoose')

const Profile = new mongoose.Schema({
    firstname: { type: String, trim: true, default: "" },
    lastname: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, default: "" },
    passwordHash: { type: String, trim: true, default: "" },
    admin: {type: Boolean, trim: true, default:false}
})

module.exports = mongoose.model('Profile', Profile)