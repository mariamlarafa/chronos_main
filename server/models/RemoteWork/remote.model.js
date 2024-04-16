import { DataTypes } from "sequelize";
import database from "../../db/db.js";

const Remote = database.define(
  "remotes",
  {
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    remoteDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "En cours",
      allowNull: true
    }
    ,
    userID :{
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true
    }
  },
  { timestamps: true }
);

export default Remote;
