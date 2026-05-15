const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { // 'name' ko badal kar 'username' kar diya
        type: String,
        required: [true, "Username zaroori hai"]
    },
    email: {
        type: String,
        required: [true, "Email zaroori hai"],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password zaroori hai"],
        minlength: 6 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);