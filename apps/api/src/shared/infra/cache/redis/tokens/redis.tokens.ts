import { Redis } from 'ioredis';

export type RedisClient = Redis;
export const REDIS_CLIENT = Symbol('REDIS_CLIENT');
export const REDIS_CACHE = Symbol('REDIS_CACHE');
