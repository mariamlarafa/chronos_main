import { DataTypes } from "sequelize";
import database from "../../db/db.js";

const Intervenant = database.define("intervenant", {
    nbHours:{
        type:DataTypes.FLOAT,
        allowNull:false,
        defaultValue:0
    },
    file:{
        type:DataTypes.TEXT('medium'),
        allowNull:true
    }
}, { timestamps: true });



export default Intervenant