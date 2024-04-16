// remoteLib.js

import Remote from "../../models/RemoteWork/Remote.model.js";
import { User } from "../../db/relations.js"; // Adjust the path as per your project structure

/**
 * Checks if a remote work exists based on its ID
 * @param {string} remoteId - The ID of the remote work
 * @returns {Promise<boolean>} - Indicates whether the remote work exists or not
 */
export const isRemoteExist = async (remoteId) => {
  const remote = await Remote.findByPk(remoteId);
  return !!remote;
};

/**
 * Fetches all remote works
 * @returns {Promise<Array>} - Array of remote works
 */
export const getAllRemotes = async () => {
  const remotes = await Remote.findAll();
  return remotes;
};

/**
 * Fetches all remote works for a specific user email provided in the request body
 * @param {string} email - The email of the user
 * @returns {Promise<Array>} - Array of remote works associated with the user
 */
export const getAllRemotesByEmail = async (email) => {
  try {
    if (!email) return null;

    // Retrieve the user by email to get the corresponding userID
    const user = await getUserByEmail(email);
    if (!user) {
      return []; // Return an empty array if user is not found
    }

    // Fetch remote works associated with the userID
    const queryOptionsRemote = {
      where: { userID: user.id }
    };
    const remotes = await Remote.findAll(queryOptionsRemote);
   
    return remotes;
  } catch (error) {
    throw error;
  }
};

/*
 * Fetches user by email
 * @param {string} email - The email of the user
 * @param {boolean} includeProfile - Whether to include user profile or not
 * @param {boolean} withBanned - Whether to include banned users or not
 * @returns {Promise<User>} - User object if found, otherwise null
 */
export const getUserByEmail = async (
  email,
  withBanned = false
) => {
  if (!email) return null;
  const queryOptions = {
    where: { email: email, isBanned: withBanned }
  };
  const user = await User.findOne(queryOptions);
  if (user) return user;
  return null;
};
