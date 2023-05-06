import jwt from "jsonwebtoken"

/**
 *
 * @param {String} firstname
 * @param {String} lastname
 * @description generate access token that stores user data and returns it
 * @returns {String} Access token
 */
export const generateAccessToken = (id, firstname, lastname) => {
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
export const generateRefreshToken = (id, firstname, lastname) => {
  return jwt.sign(
    { id, firstname, lastname },
    process.env.REFRESH_TOKEN_SECRET,
  );
};
