import { DataTypes } from "sequelize";
import database from "../../db/db.js";

const Phase = database.define("phase", {
  name: {
    type: DataTypes.STRING(3),
    allowNull: false,
    unique: true,
    set(value) {
      this.setDataValue("name", value.toUpperCase());
    }
  },
  abbreviation: {
    type: DataTypes.CHAR,
    allowNull: false,
    set(value) {
      this.setDataValue("abbreviation", value.toUpperCase());
    }
  }
});

export default Phase;
