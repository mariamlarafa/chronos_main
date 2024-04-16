import { execSync } from "child_process";

import fs from "fs";
import path from "path";
import { UnknownError } from "./appError.js";



export const createMedia = (fileName, mediaDirectory, content) =>
  new Promise((resolve, reject) => {
    if (!fs.existsSync(path.join("../images", mediaDirectory))) {
      execSync(` sudo mkdir -p "${path.join("../images", mediaDirectory)}"`);
    }
    try {
      fs.writeFileSync(
        path.join("../images", mediaDirectory, fileName),
        content
      );
      return resolve(path.join(mediaDirectory, fileName));
    } catch (e) {
      return reject(new UnknownError(e.message));
    }
  });

export const createMediaUrl = (fileObject) => {
  // Construct the URL by joining the domain name, uploads directory, and filename
  const imageUrl = `/${fileObject.destination}/${fileObject.filename}`;
  return imageUrl;
};
