const axios = require('axios');



const getUserInfo = async (request, response, next) => {
  if (request.headers.authorization) {
      const accessToken = request.headers.authorization.split(' ')[1];
      const userInfoResponse = await axios.get('https://dev-vgne2g3s5s05ruv2.us.auth0.com/userinfo', {
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      });
      request.user = {
        name: userInfoResponse.data.name,
        email: userInfoResponse.data.email
      };
  }
  next();
};

module.exports = { getUserInfo };