import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL, { connectTimeout: 10000, maxRetriesPerRequest: 5 });
export async function storeState(state, userId) {
  await redis.set(`state:${state}`, userId, "EX", 300);
}

export async function getUserIdByState(state) {
  return await redis.get(`state:${state}`);
}
