require("dotenv").config();
const { Biota } = require("../../../dist");
const open = require("open");

const { framework } = new Biota();

open(
  framework.auth.github.connectUrl({
    client_id: process.env.CLIENT_ID,
    redirect_uri: "http://localhost:3003/oauth/github/callback"
  })
);
