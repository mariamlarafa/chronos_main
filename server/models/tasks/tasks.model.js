import { DataTypes } from "sequelize";
import database from "../../db/db.js";
import { STATE_DOING } from "../../constants/constants.js";

const Task = database.define(
  "task",
  {
    name: {
      type: DataTypes.STRING,
      // unique:true,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    blockedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    doneDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    totalHours: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: STATE_DOING
    },
    meta:{
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    }
  },
  {
    timestamps: true,
    hooks: {
      beforeUpdate: (instance, options) => {
        // Capture the old values before the update
        instance.oldValues = { ...instance._previousDataValues };
      }
    }
  }
);

export default Task;
