const Menu=require("../models/menuModel")
const {cloudinary}=require("../cloudinary/cloudinary.js")


// Adding the food items based on the category and sub category

const addFoodItem = async (req, res) => {
    try {

        let { name, price, description,menuType, subcategory } = req.body;

        const fileStr=req.body.image;

        let errorField=[];
        
        if(!name){
            errorField.push("name");
        }

        if(!price){
errorField.push("price");
        }

        if(!description){
            errorField.push("description");
        }

        if(!menuType){
            errorField.push("menuType");

        }

      

        if(!fileStr){
            errorField.push("fileStr");
        }


        if ((menuType === "Main Courses" || menuType === "Drink Menu") && !subcategory)  {
            errorField.push("subcategory");
        }

        if(errorField.length > 0){
            return res.status(400).json({
                status:"failed",
                errorField,
                error:"Please check for an error",
          
               
            })
        }
        const uploadedResponse= await cloudinary.uploader.upload_large(fileStr,{
            upload_preset:'images_preset'
        });

        if(!uploadedResponse){
            return res.status(500).json({
                status:"failed",
                error:error.message
            })
        }

        const {secure_url}=uploadedResponse;


        let item;
        if (menuType === "Main Courses" || menuType === "Drink Menu") {
            // If menuType is "Main Courses" or "Drink Menu", include subcategory


            item = await Menu.create({
                name: name,
                price: price,
                description: description,
                imgUrl:secure_url,
                menuType: {
                    category: menuType,
                    subcategory: subcategory
                }
            });
        } else {
            // For other menu types, omit subcategory
            item = await Menu.create({
                name: name,
                price: price,
                imgUrl:secure_url,
                description: description,
                menuType: {
                    category: menuType
                }
            });
        }
        if(!item){
            return res.status(500).json({
                status:"failed",
                error:error.message
            })
        }

        res.status(201).json({ success: true, message:"Successfully added a food", data: item });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};



// getting a food by category..
const getFoodByCategory=async(req,res)=>{
    const {category}=req.params;
    try {
        const catezorizedFood = await Menu.find({ 'menuType.category': `${category}` });

        if(catezorizedFood.length === 0){
       return res.status(404).json({
            status:"failed",
            message:"Couldn't found any foods items by category"
        })
        }

        res.json({
            count:catezorizedFood.length,
            catezorizedFood
        });
   
    } catch (error) {
        res.status(500).json({
            status:"failed",
            error:error.message
        })
    }
}



// get a food item of Main courses by a sub category

const getMainCoursesBySubCategory=async(req,res)=>{

    const { subcategory } = req.params;
    try {

           
            subcategoryFood = await Menu.find({ 'menuType.subcategory': `${subcategory}` });
    
        if (subcategoryFood.length === 0) {
            return res.status(404).json({
                status: "failed",
                message: "Couldn't find any food items"
            });
        }

        res.json({
            count: subcategoryFood.length,
            subcategoryFood
        });
   
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: error.message
        });
    }
}





const getDrinksBySubCategory=async(req,res)=>{

    const { subcategory } = req.params;
    try {

           
            subcategorydrink = await Menu.find({ 'menuType.subcategory': `${subcategory}` });
    
        if (subcategorydrink.length === 0) {
            return res.status(404).json({
                status: "failed",
                message: "Couldn't find any drink items"
            });
        }

        res.json({
            count: subcategorydrink.length,
            subcategorydrink
        });
   
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: error.message
        });
    }
}





const getAllFoods=async(req,res)=>{
    try {
        const foods=await Menu.find({});
        if(foods.length === 0){
            return res.status(404).json({
                status:"failed",
                message:"No foods found"
            })
        }

        res.status(200).json({
            status:"success",
            count:foods.length,
            foods
        })
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: error.message
        });
    }
}




const deleteFood=async(req,res)=>{
    const {id}=req.params;
    try {
       const food=await Menu.findOneAndDelete({_id:id}) 

       if(!food){
        return res.status(404).json({
            status:"failed",
            message:"Couldn't found the food to delete"
        })
       }

       res.status(200).json({
        status:"success",
        deletedfood:food
       })
    } catch (error) {
        res.status(500).json({
            status:"failed",
            error:error.message
        })
    }

}



const SearchFood=async (req, res) => {
    const searchTerm = req.query.term; 

    try {
       
        const foundfoods = await Menu.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } }, 
            ]
        });

        res.status(200).json(foundfoods);
    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



module.exports={addFoodItem,getFoodByCategory,getMainCoursesBySubCategory,getDrinksBySubCategory,getAllFoods,deleteFood,SearchFood};