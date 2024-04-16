import { DataTypes } from "sequelize";
import database from "../../db/db.js";
import logger from "../../log/config.js";

const UserProfile = database.define("UserProfile", {
    name:{
        type:DataTypes.STRING,
        allowNull:true
    },
    lastName:{
        type:DataTypes.STRING,
        allowNull:true
    },
    poste:{
        type:DataTypes.STRING,
        allowNull:true
    },
    phone:{
        type:DataTypes.STRING,
        allowNull:true
    },
    image:{
        type:DataTypes.STRING,
        allowNull:true
    },
    userID:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
//    street:{
//         type:DataTypes.STRING,
//    },
//    city:{
//     type:DataTypes.STRING,
//    },
//    region:{
//     type:DataTypes.STRING,
//    },
   address:{
    type:DataTypes.STRING,
   },
   hireDate:{
        type:DataTypes.STRING
   }

}, { timestamps: true });






export default UserProfile;
