const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name zaroori hai"]
    },
    email: {
        type: String,
        required: [true, "Email zaroori hai"],
        unique: true, // only one user can access by using one account
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password zaroori hai"],
        minlength: 6 // At least 6 characters for password for stroing security
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);