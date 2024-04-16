import { DataTypes } from 'sequelize'
import database from '../../db/db.js'


const Lot = database.define("lots",{
    name:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
        set(value) {
            this.setDataValue("name", value.toUpperCase());
          }
    }
}, { timestamps: true })

export default Lot