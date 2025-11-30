import { Redis } from 'ioredis';

export type RedisClient = Redis;
export const REDIS_CLIENT = Symbol('REDIS_CLIENT');
