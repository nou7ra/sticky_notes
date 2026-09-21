import { redis_client } from "../connectionRedis.js";
export const revokeTokenKey = async ({ userId, tokenId } = {}) => {
  return `revoke_token:${userId}:${tokenId}`;
};
export const getKey = async (userId) => {
  return `revoke_token:${userId}`;
};
export const max_otp_Key = async (email) => {
  return `otp:${email}:max`;
};
export const block_otp_Key = async (email) => {
  return `otp:${email}:block`;
};
export const otpKey = async (email) => {
  return `otp:${email}`;
};
export const setValue = async ({ key, value, ttl } = {}) => {
  try {
    value = typeof value == "string" ? value : JSON.stringify(value);
    return ttl
      ? await redis_client.set(key, value, { EX: ttl })
      : await redis_client.set(key, value);
  } catch (error) {
    console.log(error, `\nredis setValue failed`);
  }
};
export const update = async ({ key, value, ttl } = {}) => {
  try {
    if (!(await redis_client.exists(key))) return 0;
    return await setValue({ key, value, ttl });
  } catch (error) {
    console.log(error, `\nredis updateValue failed`);
  }
};
export const get = async (key) => {
  try {
    try {
      return JSON.parse(await redis_client.get(key));
    } catch (error) {
      return await redis_client.get(key);
    }
  } catch (error) {
    console.log(error, `\nredis get failed`);
  }
};

export const ttl = async ({ key, value, ttl } = {}) => {
  try {
    return await redis_client.ttl(key);
  } catch (error) {
    console.log(error, `\nredis ttl failed`);
  }
};

export const exists = async ({ key, value, ttl } = {}) => {
  try {
    return await redis_client.exists(key);
  } catch (error) {
    console.log(error, `\nredis exists failed`);
  }
};
export const expire = async ({ key, value, ttl } = {}) => {
  try {
    return await redis_client.expire(key);
  } catch (error) {
    console.log(error, `\nredis expire failed`);
  }
};
export const deleteKey = async ({ key, value, ttl } = {}) => {
  try {
    if (!key?.length) return 0;
    return await redis_client.del(key);
  } catch (error) {
    console.log(error, `\nredis deleteKey failed`);
  }
};
export const keys = async (pattern) => {
  try {
    return await redis_client.keys(`${pattern}*`);
  } catch (error) {
    console.log(error, `\nredis keys failed`);
  }
};
export const incr = async (email) => {
  try {
    const key = await max_otp_Key(email);
    return await redis_client.incr(key);
  } catch (error) {
    console.log(error, "\nredis incr failed");
  }
};