const S3_ENDPOINT =
  process.env.EXPO_PUBLIC_S3_ENDPOINT ?? "http://10.0.2.2:9000";

export function buildMediaUrl(key: string): string {
  return `${S3_ENDPOINT}/media/${key}`;
}
