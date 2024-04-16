import { DataTypes } from "sequelize";
import database from "../../db/db.js";
import { INTERVENANT_ROLE } from "../../constants/constants.js";

const Leave = database.define(
  "leaves",
  {
    dateDebut: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: true
    },
    dateFin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "En cours",
      allowNull: true
    },
    userID :{
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true
    }
  },
  { timestamps: true }
);

export default Leave;