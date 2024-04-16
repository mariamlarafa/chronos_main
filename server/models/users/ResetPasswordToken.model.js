import { DataTypes } from "sequelize";
import database from "../../db/db.js";
import logger from "../../log/config.js";


const ResetPasswordToken = database.define(
    "resetPasswordToken",
    {
        token:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true
        },
        expiresAt:{
            type:DataTypes.DATE,
            allowNull:false
        },
        expired:{
            type:DataTypes.BOOLEAN,
            defaultValue:false,
            allowNull:false
        },
        userID:{
            type:DataTypes.INTEGER,
            allowNull:false
        }
    },
    { timestamps: true }
)


export default ResetPasswordToken