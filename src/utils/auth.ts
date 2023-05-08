import jwt from "jsonwebtoken"
import { Schema } from "mongoose";

type TokenFunc = (
  _id: Schema.Types.ObjectId,
  firstname: string,
  lastname: string
) => any

/**
 *
 * @param {String} firstname
 * @param {String} lastname
 * @description generate access token that stores user data and returns it
 * @returns {String} Access token
 */
export const generateAccessToken: TokenFunc = (id, firstname, lastname) => {
  return jwt.sign(
    { id, firstname, lastname },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '43200s', // 43200 seconds = 12 hours
    },
  );
}; // normally it should be 15 mins === 900s

/**
 *
 * @param {String} firstname
 * @param {String} lastname
 * @description generate refresh token that stores user data and returns it
 * @returns {String} Refresh token
 */
export const generateRefreshToken: TokenFunc = (id, firstname, lastname) => {
  return jwt.sign(
    { id, firstname, lastname },
    process.env.REFRESH_TOKEN_SECRET,
  );
};
