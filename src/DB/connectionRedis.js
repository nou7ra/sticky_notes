import { createClient } from "redis";

export const redis_client = createClient({
  url: "rediss://default:gQAAAAAAAhYuAAIgcDIwOGVjMmYxY2VhNzk0NWIxYmMxNTNmZmFjMWRlZDBjNA@gentle-falcon-136750.upstash.io:6379",
});

const checkConnection_redis = async () => {
  try {
    await redis_client.connect();
    console.log("redis connected successfully");
  } catch (error) {
    console.log("redis Failed to connect");
  }
};
export default checkConnection_redis;