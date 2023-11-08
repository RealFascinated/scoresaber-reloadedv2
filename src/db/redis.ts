import { createClient } from "redis";

let redisClient = await connectRedis();

async function connectRedis(): Promise<any> {
  console.log("Connecting to redis");
  const client = createClient({
    url: process.env.REDIS_URL,
  });
  await client.connect();

  client.on("connect", () => {
    console.log("Connected to redis");
  });

  client.on("error", (error) => {
    console.error("There was an error connecting to redis: " + error);
    setTimeout(() => {
      redisClient = connectRedis();
    }, 5_000); // 5 seconds
  });

  return client;
}

// todo: add disconnect handler

export const Redis = {
  client: redisClient,
  connectRedis,
};
