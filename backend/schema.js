const { ObjectId, Long } = require("mongodb")
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        minlength: 3,
        maxlength: 30
    },
    password: {
        type: String,
        required: true,
        minlength: 6,

    },
    firstname: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }

})


const accountSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true,
    }
})

const Account = mongoose.model('Account', accountSchema)
const User = mongoose.model('User', userSchema)

module.exports = { User, Account }
