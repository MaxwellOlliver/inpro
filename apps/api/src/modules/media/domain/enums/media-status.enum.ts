export const MediaStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  READY: 'READY',
  FAILED: 'FAILED',
} as const;

export type MediaStatus = (typeof MediaStatus)[keyof typeof MediaStatus];
