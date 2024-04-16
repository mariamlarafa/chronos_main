import { readFileSync } from "fs";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import logger from "../log/config.js";

const currentFilePath = fileURLToPath(import.meta.url);

const currentDirectory = path.dirname(currentFilePath);

export const getRSAPrivateKey = async () => {
  try {
    const encryptFolderPath = path.join(
      currentDirectory,
      "..",
      "..",
      ".encrypt"
    );

    const privateKeyPath = path.join(encryptFolderPath, "secret_key.pem");

    const key = readFileSync(privateKeyPath, "utf8");
    return key;
  } catch (error) {
    logger.error(error);
  }
};
export const getRSAPublicKey = async () => {
  try {
    const encryptFolderPath = path.join(currentDirectory, "..", ".encrypt");
    const publicKeyPath = path.join(encryptFolderPath, "public_key.pem");

    const key = readFileSync(publicKeyPath, "utf8");

    return key;
  } catch (error) {
    logger.error(error);
  }
};

export function removeDuplicates(arr) {
  return [...new Set(arr)];
}

export const findObjectDifferences = (oldObject, newObject) => {
  const differences = {};

  // Helper function to recursively compare nested objects
  const compareObjects = (obj1, obj2, prefix = "") => {
    if (!obj1 || !obj2) {
      return;
    }
    Object.keys(obj1).forEach((key) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj1[key] === "object" && typeof obj2[key] === "object") {
        compareObjects(obj1[key], obj2[key], fullKey);
      } else if (obj1[key] && obj2[key] && obj1[key] !== obj2[key]) {
        differences[fullKey] = {
          oldValue: obj1[key],
          newValue: obj2[key]
        };
      }
    });
  };

  // console.log("old ggggggggggg-------------------------",oldObject,oldObject);
  compareObjects(oldObject, newObject);

  return differences;
};

export async function deleteFile( dynamicRelativePath) {
  const currentModulePath = new URL(import.meta.url).pathname;
  const rootDir = path.dirname(path.dirname(currentModulePath));



  const relativePath = dynamicRelativePath.replace(/^\/\./, "");

  const filePath = path.join(rootDir, relativePath).replace("\\C:", "");

  try {
    await fs.access(filePath);

    // Delete the file
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.log(error);
    if (error.code === "ENOENT") {
      console.log(`File not found: ${filePath}`);
      return false;
    }
    console.error(`Error deleting file ${filePath}: ${error.message}`);
    return false;
  }
}
