const mongoose = require('mongoose');

// Define the schema for the AdminVerificationCode model
const adminVerificationCodeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the AdminVerificationCode model
const AdminVerificationCode = mongoose.model('AdminVerificationCode', adminVerificationCodeSchema);

module.exports = AdminVerificationCode;
