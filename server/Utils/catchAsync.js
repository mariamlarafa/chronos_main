import sequelize from "../db/db.js";

export const catchAsync  = fn =>{
    return (req,res,next)=>{

    fn(req,res,next).catch(next) ;
    }

}

// Middleware for wrapping route handlers
// export const catchAsync = (fn) => {
//     return (req, res, next) => {
//       sequelize.transaction(async (t) => {
//         try {
//           // Pass the transaction 't' to your route handler function 'fn'
//           await fn(req, res, next, t);
//         } catch (error) {
//           // Handle any errors
//           next(error);
//         }
//       });
//     };
//   };