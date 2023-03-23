require("dotenv").config;

function getGoogleOAuthURL() {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const options = {
    redirect_uri: `${process.env.OAUTH_REDIRECT}`,
    client_id: `${process.env.OAUTH_CLIENT_ID}`,
    accessType: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const query = new URLSearchParams(options);

  return `${rootUrl}?${query.toString()}`;

  //we need to get code (id and access token) from the query on our redirect URI
  //get user with token
  //upsert user and create session and tokens and also set cookie for the user
}

module.exports = getGoogleOAuthURL;
