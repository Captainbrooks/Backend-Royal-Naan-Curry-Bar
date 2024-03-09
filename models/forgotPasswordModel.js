const mongoose = require('mongoose');

// Define the schema for the AdminVerificationCode model
const PasswordResetSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    used:{
type:Boolean,
default:false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the AdminVerificationCode model
const PasswordReset = mongoose.model('PasswordReset', PasswordResetSchema);

module.exports = PasswordReset;
