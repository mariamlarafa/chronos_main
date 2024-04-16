import { DataTypes } from "sequelize";
import database from "../../db/db.js";
import { STATE_DOING } from "../../constants/constants.js";

const Project = database.define(
  "projects",
  {
    code: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false
    },
    customId: {
      type: DataTypes.STRING,
      unique: false
    },
    name: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false
    },

    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    dueDate: {
      type: DataTypes.DATE,
      defaultValue:null,
      allowNull: true
    },
    priority: {
      type: DataTypes.INTEGER
    },
    //references keys
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    manager: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    managerHours: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    isCodeCustomized: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: STATE_DOING
    },
    prevPhaseTmp: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:null
    }
  },
  {
    timestamps: true,
    hooks: {
      beforeUpdate: (instance, options) => {
        // Capture the old values before the update
        instance.oldValues = { ...instance._previousDataValues };
      },
      afterBulkCreate: async (instances, options) => {
        const projects = instances.filter((project) => project.prevPhaseTmp);
        for (const idx in projects) {
          let project = projects[idx];
          let phase = JSON.parse(project.prevPhaseTmp);
          const prevPhase = await Project.findOne({
            where: {
              code: phase.code,
              customId: phase.customId
            }
          });
          project.prevPhase = prevPhase? prevPhase.id:null;
          project.save();
        }
      }
    }
  }
);

export default Project;
