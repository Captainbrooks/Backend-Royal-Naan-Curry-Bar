const express=require("express");
const router=express.Router();
const requireAuth=require("../Authentication/requireAuth");
const isAdmin=require("../Authentication/isAdmin");
const {addFoodItem, getFoodByCategory,getMainCoursesBySubCategory,getDrinksBySubCategory,getAllFoods, deleteFood}=require("../Controllers/menuController");

router.get("/fooditem/getfoods",getAllFoods);
router.get("/fooditem/:category",getFoodByCategory)
router.get("/fooditem/MainCourses/:subcategory",getMainCoursesBySubCategory)
router.get("/fooditem/DrinkMenus/:subcategory",getDrinksBySubCategory)
router.post("/fooditem",addFoodItem);

router.delete("/fooditem/delete/:id",isAdmin,deleteFood)

module.exports= router;

