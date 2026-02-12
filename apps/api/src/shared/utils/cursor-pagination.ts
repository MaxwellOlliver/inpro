export type CursorPagination = {
  cursor?: string;
  take: number;
};

export type CursorPaginated<T> = {
  data: T[];
  nextCursor: string | null;
};
