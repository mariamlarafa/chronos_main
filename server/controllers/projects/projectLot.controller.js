import { Lot, ProjectLots } from "../../db/relations.js";
import { messages } from "../../i18n/messages.js";
import logger from "../../log/config.js";
import { isLotsValid } from "./lot.controller.js";

export const createProjectLot = async (projectID, lots) => {
  if (!projectID || !lots)
    return {
      created: false,
      projectLot: false,
      message: messages["project_and_lot_id_mandatory"]
    };

  try {
    var projectLots = [];

    const isAllLotsValid = await isLotsValid(lots);

    if (!isAllLotsValid) {
      return {
        created: false,
        projectLot: false,
        message: messages["lot_not_found"]
      };
    }

    isAllLotsValid.every(async (lotID) => {
      const isProjectLotExists = await ProjectLots.findOne({
        where: {
          projectID,
          lotID
        }
      });
      if (isProjectLotExists)
        return {
          created: false,
          projectLots: false,
          message: messages["lot_already_assigned_to_project"]
        };

      const lot = await ProjectLots.create(
        { projectID, lotID }
        // { transaction: transaction }
      );
      projectLots.push(lot);
    });

    return {
      created: true,
      projectLots,
      // message: `lots have assigned to the project ${projectID}`
      message: messages["lots_assigned_to_project"]
    };
  } catch (error) {
    logger.error(error);
    return { created: false, message: error, projectPhase: undefined };
  }
};

const isLotsExist = async (lots) => {
  return isLotsValid(lots);
};
