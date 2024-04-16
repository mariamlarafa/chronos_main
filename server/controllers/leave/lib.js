// lib.js

import Leave from "../../models/leave/leave.model.js";
import { User } from "../../db/relations.js";

/**
 * Checks if a leave exists based on its ID
 * @param {string} leaveId - The ID of the leave
 * @returns {Promise<boolean>} - Indicates whether the leave exists or not
 */
export const isLeaveExist = async (leaveId) => {
  const leave = await Leave.findByPk(leaveId);
  return !!leave;
};

/**
 * Fetches all leaves
 * @returns {Promise<Array>} - Array of leaves
 */
export const getAllLeaves = async () => {
  const leaves = await Leave.findAll();
  return leaves;
};

/**
 * Fetches all leaves for a specific user email provided in the request body
 * @param {string} email - The email of the user
 * @returns {Promise<Array>} - Array of leaves associated with the user
 */
export const getAllLeavesByEmail = async (email) => {
  try {
    if (!email) return null;

    // Retrieve the user by email to get the corresponding userID
    const user = await getUserByEmail(email);
    if (!user) {
      return []; // Return an empty array if user is not found
    }

    // Fetch leaves associated with the userID
    const queryOptionsLeave = {
      where: { userID: user.id }
    };
    const leaves = await Leave.findAll(queryOptionsLeave);
   
    return leaves;
  } catch (error) {
    throw error;
  }
};


/*
 *  get user By id : return the user if found or null
 * @param {*} id
 * @returns
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
