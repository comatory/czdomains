/* eslint-disable */

const minidotenv = require('minidotenv');

module.exports = () => {
  minidotenv({
    path: './.env.test',
    inject: true,
  });
};
