import { DataTypes } from "sequelize";
import database from "../../db/db.js";
import moment from "moment/moment.js";

const InterventionHour = database.define("interventionHour", {
    hours:{
        type:DataTypes.FLOAT,
        allowNull:false,
        defaultValue:0
    },
    date:{
        type:DataTypes.DATEONLY,
        allowNull:false,
        defaultValue:new Date()
    }
}, { timestamps: true });



export default InterventionHour