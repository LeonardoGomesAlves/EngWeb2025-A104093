const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String },
    name: { type: String, required: true },
    level: { type: String, required: true },
    creationDate: { type: Date, required: true },
    facebookId: { type: String },
    googleId: { type: String },
    avatar: {type: String, default: null}
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'username'
})

module.exports = mongoose.model('user', userSchema)
