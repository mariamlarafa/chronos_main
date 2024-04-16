import { DataTypes } from "sequelize";
import database from "../../db/db.js";
import Project from "./Project.model.js";
import Lot from "./Lot.model.js.js";

const ProjectLots = database.define("projectLots", {});

export default ProjectLots;
