import { formatDistanceToNow } from 'date-fns';

export interface CreatedAt {
  createdAt: Date;
}

export function sortByCreated(items: CreatedAt[]): void {
  items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function formatAgo(item: Date|CreatedAt): string {
  const date = item instanceof Date ? item : item.createdAt;

  return formatDistanceToNow(date, { addSuffix: true });
}
