const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is Required"],
    },
    email: {
        type: String,
        required: [true, "Email is Required"],
    },
    phone: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: true
    }
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
