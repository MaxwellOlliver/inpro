export const MediaType = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  AUDIO: 'AUDIO',
  DOCUMENT: 'DOCUMENT',
  OTHER: 'OTHER',
} as const;

export type MediaType = (typeof MediaType)[keyof typeof MediaType];
