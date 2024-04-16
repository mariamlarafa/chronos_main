import moment from "moment";
import {
  action_codes,
  action_phrases,
  action_titles_fr,
  actions_list
} from "../constants/constants.js";
import logger from "../log/config.js";
import fs from "fs/promises";
import readline from "readline";
import { createReadStream } from "fs";
import { User, UserProfile } from "../db/relations.js";
import { serializeSimpleUserObject } from "../controllers/users/lib.js";
export const takeNote = async (
  actionName,
  email,
  projectID,
  { taskName = null, requestName = null, extraProps = null }
) => {
  if (!actions_list.includes(actionName)) {
    logger.error("action name unknown");
    return null;
  }
  if (!email) {
    logger.error(`the user email was not provided: value ${email}`);
    return null;
  }
  const code = action_codes.find((line) => line.action === actionName)?.code;
  if (!code) {
    logger.error(
      `code is unknown                                                                                       `
    );
    return null;
  }

  try {
    let note = {
      projectID,
      taskName,
      requestName,
      email: email,
      action: actionName,
      code,
      action_date: moment().format("DD/MM/YYYY"),
      ...extraProps
    };
    const existingContent = await fs.readFile(
      "../server/tracking/tracking.txt",
      "utf-8"
    );

    // Append the new note and a newline character
    const updatedContent = existingContent + JSON.stringify(note) + "\n";

    // Write the updated content back to the file
    await fs.writeFile("../server/tracking/tracking.txt", updatedContent);
    return true;
  } catch (error) {
    logger.error(error);
    return false;
  }
};

export const getTracking = async (projectID) => {
  try {
    const fileStream = createReadStream("../server/tracking/tracking.txt");

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    let projectTracking = [];
    for await (const line of rl) {
      const data = JSON.parse(line);
      if (data.projectID !== parseInt(projectID)) continue;
      const text = action_phrases[data.code](data);
      const user = await User.findOne({
        where: { email: data.email },
        attributes: ["email"],
        include: [
          {
            model: UserProfile,
            attributes: ["image", "name", "lastName"]
          }
        ]
      });

      projectTracking.push({
        date: data.action_date,
        title: action_titles_fr[data.code],
        text,
        user :serializeSimpleUserObject(user)
      });
    }

    return projectTracking;
  } catch (error) {
    logger.error(error);
    return false;
  }
};
