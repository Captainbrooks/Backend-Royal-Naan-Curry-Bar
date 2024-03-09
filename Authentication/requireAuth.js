const jwt = require("jsonwebtoken");
require("dotenv").config();




// Thid requireAuth middleware is for the protected routes..
// in this application.. I have set the jwt token inside the cookie..

// so first method of obtaining the token is from cookies..
//


// first method starts from =>>

// const requireAuth=(req,res,next)=>{

//     // get the token from the headers of cookies..

//     const token=req.cookies.jwt;

  

//     // checking if token exists if yes then we go to verify the token..
//     // jwt.verify takes three paramater the first one being token, second one being the SECRET stored inside the server and last one is the call back function..
//     // if token is verified we call the next() middleware and if not then send the failed status...



//     if(token){
//         jwt.verify(token,process.env.SECRET,(error,decodedToken)=>{
//             if(error){

//                 console.log(error);
//               return  res.status(401).json({
//                     status:"failed",
//                     error:error.message
//                 })
//             }
//             next();
//     })
//     }else{
//         console.log('token is undedined');
//         res.status(404).json({
//             status:"failed",
//             message:"Token is undefined"
//         })
//     }
// }




// this method of protecting routes is somehthing I am familiar with.. the jwt token is passed to authorization headers then we extract the jwt token
// basically we set token as Bearer token so firstly we make sure we have authorization headers..
// if authorization headers is present there must be in this fortmat : Bearer {token} 
// so we convert the authorization header into a array of string.. and then we extract the second element of array {0 bein the first index which would be Bearer) 
// then token is extracted and again if check if token isn't present we return the failed response with status but if we have then we go to verify
// which resembles the same above process.. 



// Second method starts from==>>

const requireAuth = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(404).json({
            status: "failed",
            message: "Authorization headers not found"
        })
    }

    const token = authorization.split(" ")[1];
    console.log(token);

    if (!token) {
        return res.status(401).json({
            status: "failed",
            message: "Invalid token"
        })
    }

    jwt.verify(token, process.env.SECRET, (error, decodedToken) => {

        if (error) {

            console.log(error);
            return res.status(401).json({
                status: "failed",
                error: error.message
            })
        }
        console.log(decodedToken); 
        next();
    })
}

module.exports = requireAuth;

