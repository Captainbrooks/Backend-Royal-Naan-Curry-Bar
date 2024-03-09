const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imgUrl: {
        type: String,
        required: true
    },
    menuType: {
        type: {
            category: {
                type: String,
                enum: ["Starter Menus", "Main Courses", "Traditional Breads", "Drink Menu", "Desert Menu"],
                required: true
            },
            subcategory: {
                type: String,
                required: function() {
                    return this.category === "Main Courses" || this.category === "Drink Menu";
                },
                enum: {
                    values: ["Veg", "Chicken", "Mutton", "Soft Drinks", "Coffee & Tea", "Beverages"],
                    message: '{VALUE} is not a valid subcategory'
                }
            }
        },
        required: true
    }
});






const Menu=new mongoose.model("Menu",MenuSchema);

module.exports = Menu;
