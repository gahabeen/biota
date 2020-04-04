require("dotenv").config();
const fastify = require("fastify")({ logger: true });
const axios = require("axios");
const qs = require("querystring");

const { Biota } = require("../../../dist");
const { framework } = new Biota();

// Declare a route
fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});

fastify.get("/oauth/google/callback", async (request, reply) => {
  let { code } = request.query;

  let { access_token } = await framework.auth.google.authenticate({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code,
    redirect_uri: "http://localhost:3003/oauth/google/callback"
  });

  let user = await framework.auth.google.userInfo({ access_token });
  let token = await framework.auth.google.tokenInfo({ access_token });
  reply.send({ user,token, access_token });
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3003);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
