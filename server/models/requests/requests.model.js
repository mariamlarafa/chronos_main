import { DataTypes } from "sequelize";
import database from "../../db/db.js";

const Request = database.define("requests", {
  description:{
    type:DataTypes.TEXT,
    allowNull:false
  },
  state:{
    type:DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue:0
  },
  file:{
    type:DataTypes.TEXT('medium'),
    allowNull:true
  }
,
 },{
  hooks: {
    beforeUpdate: (instance, options) => {
      // Capture the old values before the update
      instance.oldValues = { ...instance._previousDataValues };
    }
  }
 });



export default Request