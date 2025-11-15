export interface PaginationResult<T> {
  items: T[];
  nextCursor: string | null;
}

export function paginate<T>(
  items: T[],
  limit: number,
  cursor?: string
): PaginationResult<T> {
  let startIndex = 0;

  // Decode cursor → start index
  if (cursor) {
    try {
      startIndex = parseInt(
        Buffer.from(cursor, "base64").toString("utf-8"),
        10
      );
    } catch {
      startIndex = 0;
    }
  }

  const endIndex = startIndex + limit;

  const pageItems = items.slice(startIndex, endIndex);

  // Encode next cursor if more items exist
  const nextCursor =
    endIndex < items.length
      ? Buffer.from(String(endIndex)).toString("base64")
      : null;

  return {
    items: pageItems,
    nextCursor,
  };
}
