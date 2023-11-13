import { createClient } from "redis";

let redisClient = await connectRedis();

console.log(process.env.REDIS_URL);

async function connectRedis(): Promise<any> {
  // console.log("Connecting to redis");
  const client = createClient({
    url: process.env.REDIS_URL,
  });
  await client.connect();
  console.log("Connected to redis");

  client.on("error", (error) => {
    console.error("There was an error connecting to redis: " + error);
    setTimeout(async () => {
      redisClient = await connectRedis();
    }, 30_000); // 30 seconds
  });

  return client;
}

// todo: add disconnect handler

export const Redis = {
  client: redisClient,
  connectRedis,
};
